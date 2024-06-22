import { url } from "inspector";
import mongoose, { Schema, Document, Types } from "mongoose";

interface IChecklistExecutionItem extends Document {
  item: Types.ObjectId;
  name: string;
  description: string;
  tags: string[];
  assignee: string;
  timestamp: Date;
  status: string;
  url: string;
}

interface IChecklistExecution extends Document {
  items: IChecklistExecutionItem[];
  name: string;
  description: string;
  url: string;
  tags: string[];
  assignee: string;
  dueDate: Date;
  status: string;
}

const ChecklistExecutionItemSchema: Schema = new Schema({
  item: { type: Types.ObjectId, ref: "ChecklistItem", required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  assignee: { type: String, required: true, default: "Unassigned" },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, required: true, default: "pending" },
});

const ChecklistExecutionSchema: Schema = new Schema({
  items: [ChecklistExecutionItemSchema],
  name: { type: String, required: true },
  description: { type: String, required: true, default: "No description" },
  url: { type: String, required: true, default: "No URL" },
  tags: { type: [String], required: true, default: [] },
  assignee: { type: String, required: true, default: "Unassigned" },
  dueDate: { type: Date, required: true, default: Date.now },
  status: { type: String, required: true, default: "pending" },
});

const ChecklistExecution = mongoose.model<IChecklistExecution>(
  "ChecklistExecution",
  ChecklistExecutionSchema
);

export { ChecklistExecution, IChecklistExecution };
