import mongoose, { Schema, Document, Types } from "mongoose";
import { IFile } from "./file.model";

interface IFolder extends Document {
  name: string;
  type: "folder";
  parentFolder: Types.ObjectId | null;
  subfolders: Types.ObjectId[];
  files: IFile[];
  path: string;
}

const FolderSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, default: "folder" },
  parentFolder: { type: Types.ObjectId, ref: "Folder", default: null },
  subfolders: [{ type: Types.ObjectId, ref: "Folder" }],
  files: [{ type: Types.ObjectId, ref: "File" }],
  path: { type: String, required: true },
});

const Folder = mongoose.model<IFolder>("Folder", FolderSchema);

export { Folder, IFolder };
