import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 10,
  },
});

const User = model<IUser>('User', userSchema);

export default User;
