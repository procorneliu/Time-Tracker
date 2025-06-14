import bcrypt from 'bcryptjs';
import validator from 'validator';
import { Schema, model, Document, Types } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  correctPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema<IUserDocument>({
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
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (this: IUserDocument, next) {
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (this: IUserDocument, candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUserDocument>('User', userSchema);

export default User;
