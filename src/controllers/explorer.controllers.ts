import { Request, Response } from "express";
import { explorerServices } from "../services/explorer.services";
import mongoose from "mongoose";
import logger from "../logger/logger";

export const explorerControllers = {
  // Controller to get a root directory by name
  getRootDirectory: async (req: Request, res: Response) => {
    const name = req.query.name;
    try {
      const rootDirectory = await explorerServices.getRootDirectory(
        String(name)
      );
      if (rootDirectory) {
        return res.status(200).json(rootDirectory);
      } else {
        return res.status(404).json({ message: "Root directory not found" });
      }
    } catch (error: any) {
      logger.error("getRootDirectory", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  getDirectories: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const folders = await explorerServices.getFolders(id);
      return res.status(200).json({ data: folders });
    } catch (error: any) {
      logger.error("getFolders", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to get a directory by its ID
  getDirectory: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const directory = await explorerServices.getDirectoryById(
        new mongoose.Types.ObjectId(id)
      );
      if (directory) {
        return res.status(200).json(directory);
      } else {
        return res.status(404).json({ message: "Directory not found" });
      }
    } catch (error: any) {
      logger.error("getDirectory", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to get a directory by its path
  getDirectoryByPath: async (req: Request, res: Response) => {
    const path = String(req.query.path);
    try {
      const directory = await explorerServices.getDirectoryByPath(path);
      if (!directory) {
        return res.status(404).json({ message: "Directory not found" });
        return;
      }
      return res.status(200).json({ data: directory });
    } catch (error: any) {
      logger.error("getDirectoryByPath", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to get a file by its ID
  getFile: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const file = await explorerServices.getFileById(
        new mongoose.Types.ObjectId(id)
      );
      if (file) {
        return res.status(200).json(file);
      } else {
        return res.status(404).json({ message: "File not found" });
      }
    } catch (error: any) {
      logger.error("getFile", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to add a new directory
  addDirectory: async (req: Request, res: Response) => {
    const { name, parentFolderId } = req.body;
    try {
      const directory = await explorerServices.addDirectory(
        name,
        parentFolderId
      );
      return res.status(201).json(directory);
    } catch (error: any) {
      logger.error("addDirectory", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to add a new file
  addFile: async (req: Request, res: Response) => {
    const { name, folderId, data, dataSchemaType } = req.body;
    try {
      const file = await explorerServices.addFile(
        name,
        folderId,
        data,
        dataSchemaType
      );
      return res.status(201).json(file);
    } catch (error: any) {
      logger.error("addFile", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to remove a directory and its contents recursively
  removeDirectory: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await explorerServices.removeDirectory(new mongoose.Types.ObjectId(id));
      return res.status(204).json({ message: "Directory removed" });
    } catch (error: any) {
      logger.error("removeDirectory", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },

  // Controller to remove a file
  removeFile: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await explorerServices.removeFile(new mongoose.Types.ObjectId(id));
      return res.status(204).json({ message: "File removed" });
    } catch (error: any) {
      logger.error("removeFile", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      return res.status(500).json({ message: error.message });
    }
  },
  async editFileName(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const updatedFile = await explorerServices.editFileName(
        new mongoose.Types.ObjectId(id),
        name
      );
      if (!updatedFile) {
        res.status(404).json({ message: "File not found" });
        return;
      }
      res.status(200).json(updatedFile);
    } catch (error: any) {
      logger.error("editFileName", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error.message });
    }
  },

  async editFolderName(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const updatedFolder = await explorerServices.editFolderName(
        new mongoose.Types.ObjectId(id),
        name
      );
      if (!updatedFolder) {
        res.status(404).json({ message: "Folder not found" });
        return;
      }
      res.status(200).json(updatedFolder);
    } catch (error: any) {
      logger.error("editFolderName", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: error.message });
    }
  },
  moveFolder: async (req: Request, res: Response) => {
    const { folderId, newParentId } = req.body;

    console.log(folderId, newParentId);

    if (
      !mongoose.Types.ObjectId.isValid(folderId) ||
      !mongoose.Types.ObjectId.isValid(newParentId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid folderId or newParentId" });
    }

    try {
      await explorerServices.moveFolder(
        new mongoose.Types.ObjectId(folderId),
        new mongoose.Types.ObjectId(newParentId)
      );
      logger.info(`Folder moved successfully: ${folderId} to ${newParentId}`, {
        tag: "folder-move",
        location: "explorer.controllers.ts",
      });
      res.status(200).json({ message: "Folder moved successfully" });
    } catch (error: any) {
      logger.error("moveFolder", {
        tag: "error",
        location: "explorer.controllers.ts",
        error: error.message,
      });
      res.status(500).json({ message: error.message });
    }
  },
};
