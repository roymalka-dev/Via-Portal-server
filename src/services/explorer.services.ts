import mongoose, { Types, mongo } from "mongoose";
import { Folder, IFolder } from "@/models/explorer/folder.model";
import { File, IFile } from "@/models/explorer/file.model";

export const explorerServices = {
  // Get a root directory by name
  async getRootDirectory(name: string): Promise<IFolder | null> {
    return await Folder.findOne({ name, parentFolder: null })
      .populate("subfolders")
      .populate("files");
  },

  async getFolders(id: string): Promise<IFolder[]> {
    const folders = await Folder.find({ _id: id }).lean();
    return await this.populateSubfolders(folders);
  },

  async populateSubfolders(folders: IFolder[]): Promise<IFolder[]> {
    return Promise.all(
      folders.map(async (folder) => {
        const populatedFolder = await Folder.findById(folder._id)
          .populate<{ subfolders: Types.ObjectId[] }>("subfolders")
          .lean<IFolder>();

        if (populatedFolder && populatedFolder.subfolders.length > 0) {
          const populatedSubfolders = await this.populateSubfolders(
            populatedFolder.subfolders as any
          );
          populatedFolder.subfolders = populatedSubfolders as any;
        }

        return populatedFolder;
      })
    ).then(
      (folders) => folders.filter((folder) => folder !== null) as IFolder[]
    );
  },

  // Get a directory by its ID
  async getDirectoryById(id: mongoose.Types.ObjectId): Promise<IFolder | null> {
    return await Folder.findById(id).populate("subfolders").populate("files");
  },

  async getDirectoryByPath(path: string): Promise<IFolder | null> {
    return await Folder.findOne({ path })
      .populate({
        path: "subfolders",
        model: "Folder",
        select: "name path type ",
      })
      .populate({
        path: "files",
        model: "File",
        select: "name data type folder",
      })
      .exec();
  },

  // Get a file by its ID
  async getFileById(id: mongoose.Types.ObjectId): Promise<IFile | null> {
    return await File.findById(id);
  },

  // Add a new directory
  async addDirectory(name: string, parentFolderId: string): Promise<IFolder> {
    const path = parentFolderId
      ? `${await this.getFolderPath(parentFolderId)}/${name}`
      : name;

    const folder = new Folder({
      name,
      parentFolder: parentFolderId,
      path,
    });

    await folder.save();

    if (parentFolderId) {
      const parentFolder = await Folder.findById(parentFolderId);
      if (parentFolder) {
        parentFolder.subfolders.push(folder.id);
        await parentFolder.save();
      }
    }

    return folder;
  },

  // Add a new file
  async addFile(
    name: string,
    folderId: mongoose.Types.ObjectId,
    data: any,
    dataSchemaType: string
  ): Promise<IFile> {
    const folder = await Folder.findById(folderId);
    if (!folder) throw new Error("Folder not found");

    const file = new File({
      name,
      folder: folderId,
      path: `${folder.path}/${name}`,
      data,
      dataSchemaType,
    });

    await file.save();

    folder.files.push(file.id);
    await folder.save();

    return file;
  },

  // Remove a directory and its contents recursively
  async removeDirectory(id: mongoose.Types.ObjectId): Promise<void> {
    const folder = await Folder.findById(id)
      .populate("subfolders")
      .populate("files");
    if (!folder) throw new Error("Folder not found");

    // Recursively remove all subfolders
    for (const subfolderId of folder.subfolders as mongoose.Types.ObjectId[]) {
      await this.removeDirectory(subfolderId);
    }

    // Remove all files in the current folder
    for (const fileId of folder.files as any) {
      await this.removeFile(fileId);
    }

    // Remove the current folder
    await Folder.findByIdAndDelete(id);

    // Remove reference to this folder from its parent folder
    if (folder.parentFolder) {
      const parentFolder = await Folder.findById(folder.parentFolder);
      if (parentFolder) {
        parentFolder.subfolders = parentFolder.subfolders.filter(
          (subfolderId: mongoose.Types.ObjectId) => !subfolderId.equals(id)
        );
        await parentFolder.save();
      }
    }
  },

  // Remove a file
  async removeFile(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      const file = await File.findById(id);
      console.log(file);
      if (!file) throw new Error("File not found");

      const dataSchemaType = file.dataSchemaType as string;

      const schema = mongoose.model(dataSchemaType);

      if (!schema) throw new Error("Schema not found");

      await schema.findByIdAndDelete(file.data);

      const folder = await Folder.findById(file.folder);
      if (folder) {
        folder.files = folder.files.filter((fileId: any) => !fileId.equals(id));
        await folder.save();
      }

      await File.findByIdAndDelete(id);
    } catch (error: any) {
      throw new Error(`Error removing file: ${error.message}`);
    }
  },

  // Helper function to get the full path of a folder
  async getFolderPath(id: string): Promise<string> {
    const folder = await Folder.findById(id);
    if (!folder) throw new Error("Folder not found");

    return folder.path;
  },

  async editFileName(
    id: mongoose.Types.ObjectId,
    name: string
  ): Promise<IFile | null> {
    try {
      const file = await File.findById(id);
      if (!file) throw new Error("File not found");

      file.name = name;
      file.path = `${file.path.substring(
        0,
        file.path.lastIndexOf("/")
      )}/${name}`;
      await file.save();
      return file;
    } catch (error: any) {
      throw new Error(`Error editing file name: ${error.message}`);
    }
  },

  async editFolderName(
    id: mongoose.Types.ObjectId,
    name: string
  ): Promise<IFolder | null> {
    const folder = await Folder.findById(id)
      .populate("subfolders")
      .populate("files");
    if (!folder) throw new Error("Folder not found");

    const oldPath = folder.path;
    const newPath = `${oldPath.substring(0, oldPath.lastIndexOf("/"))}/${name}`;

    folder.name = name;
    folder.path = newPath;
    await folder.save();

    await this.updateSubfolderPaths(folder._id as any, oldPath, newPath);
    await this.updateFilePath(folder.files as any, oldPath, newPath);

    return folder;
  },

  async moveFolder(
    folderId: mongoose.Types.ObjectId,
    newParentId: mongoose.Types.ObjectId | null
  ): Promise<void> {
    const folder = await Folder.findById(folderId);
    if (!folder) throw new Error("Folder not found");

    const oldPath = folder.path;
    let newPath;

    if (newParentId) {
      const newParentFolder = await Folder.findById(newParentId);
      if (!newParentFolder) throw new Error("New parent folder not found");

      newPath = `${newParentFolder.path}/${folder.name}`;
      folder.parentFolder = newParentId;
    } else {
      // Moving to root
      newPath = folder.name;
      folder.parentFolder = null;
    }

    folder.path = newPath;
    await folder.save();

    await this.updateSubfolderPaths(folder._id as any, oldPath, newPath);

    if (newParentId) {
      // Ensure the folder is not duplicated in the root parent folder
      await this.removeFolderFromOldParent(folderId, folder.parentFolder);
    }
  },

  async removeFolderFromOldParent(
    folderId: mongoose.Types.ObjectId,
    newParentId: mongoose.Types.ObjectId | null
  ): Promise<void> {
    // Find the old parent folder
    const folder = await Folder.findById(folderId);
    if (folder) {
      const oldParentId = folder.parentFolder;

      if (oldParentId) {
        const oldParentFolder = await Folder.findById(oldParentId);
        if (oldParentFolder) {
          oldParentFolder.subfolders = oldParentFolder.subfolders.filter(
            (id) => !id.equals(folderId)
          );
          await oldParentFolder.save();
        }
      }
    }
  },

  async updateSubfolderPaths(
    folderId: mongoose.Types.ObjectId,
    oldPath: string,
    newPath: string
  ): Promise<void> {
    const folder = await Folder.findById(folderId)
      .populate("subfolders")
      .populate("files");

    if (!folder) throw new Error("Folder not found");

    for (const subfolderId of folder.subfolders as mongoose.Types.ObjectId[]) {
      const subfolder = await Folder.findById(subfolderId);
      if (subfolder) {
        subfolder.path = subfolder.path.replace(oldPath, newPath);
        await subfolder.save();
        await this.updateSubfolderPaths(subfolder._id as any, oldPath, newPath);
      }
    }

    for (const fileId of folder.files as any) {
      await this.updateFilePath(fileId, oldPath, newPath);
    }
  },

  async updateFilePath(
    fileId: mongoose.Types.ObjectId,
    oldPath: string,
    newPath: string
  ): Promise<void> {
    const file = await File.findById(fileId);
    if (file) {
      file.path = file.path.replace(oldPath, newPath);
      await file.save();
    }
  },
};
