import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  authorizations: string[];
}

const IUserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  authorizations: [{ type: String }],
});

const User = mongoose.model<IUser>("User", IUserSchema);

export { User, IUser };
