import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { required: true, type: String, unique: true },
  name: { requrired: true, type: String },
  password: { minlength: 6, required: true, type: String },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
