import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  Owner = 'owner',
  Staff = 'staff',
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: UserRole, default: 'staff' },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
