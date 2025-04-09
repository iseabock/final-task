import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'qa';
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['admin', 'developer', 'qa'],
    default: 'developer',
  },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
