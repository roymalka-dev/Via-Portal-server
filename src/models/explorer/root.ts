import mongoose, { Schema, Document, Types } from "mongoose";

interface IRootDirectory extends Document {
  name: string;
  rootFolder: Types.ObjectId; // Reference to the root folder
}

const RootDirectorySchema: Schema = new Schema({
  name: { type: String, required: true },
  rootFolder: { type: Types.ObjectId, ref: "Folder", required: true },
});

const RootDirectory = mongoose.model<IRootDirectory>(
  "RootDirectory",
  RootDirectorySchema
);

export { RootDirectory, IRootDirectory };
