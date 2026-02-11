import mongoose,  { model, Schema } from "mongoose";
import { IUser, Role } from "../types";

export const userSchema = new Schema<IUser>({
  id: { type: String},
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  phone: { type: String },
  googleSSOId: { type: String },
  role: {
    type: Number,
    enum: Object.values(Role).filter((v) => typeof v === "number"),
    default: Role.ROLE_WORKSPACE_USER,
    required: true,
  },
  workflows: { type: [String]},
  createdAt: {type: Date}
});


export const UserModel = model<IUser>('user', userSchema);
