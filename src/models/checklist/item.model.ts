import mongoose, { Schema, Document } from "mongoose";

interface IChecklistItem extends Document {
  name: string;
  description: string;
  url: string;
  tags: string[];
}

const IChecklistItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  tags: { type: [String], required: true },
});

const ChecklistItem = mongoose.model<IChecklistItem>(
  "ChecklistItem",
  IChecklistItemSchema
);

export { ChecklistItem, IChecklistItem };
