import mongoose, { Schema, Document } from "mongoose";

interface ITag extends Document {
  name: string;
}

const ITagSchema: Schema = new Schema({
  name: { type: String, required: true },
});

const Tag = mongoose.model<ITag>("Tag", ITagSchema);

export { Tag, ITag };
