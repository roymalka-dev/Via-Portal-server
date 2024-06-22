import mongoose, { Schema, Document } from "mongoose";

interface IFile extends Document {
  name: string;
  type: "file";
  path: string;
  folder: mongoose.Types.ObjectId;
  data: any;
  dataSchemaType: string;
}

const FileSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, default: "file" },
  path: { type: String, required: true },
  folder: { type: mongoose.Types.ObjectId, ref: "Folder", required: true },
  data: { type: Schema.Types.Mixed, default: {} },
  dataSchemaType: { type: String, required: true },
});

const File = mongoose.model<IFile>("File", FileSchema);

export { File, IFile };
