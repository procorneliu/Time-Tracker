import bcrypt from 'bcryptjs';
import validator from 'validator';
import { Schema, model, Document, Types } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
  passwordChangedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  // _id: Types.ObjectId;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  correctPassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema<IUserDocument>(
  {
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
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Incorrect email format!',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
      select: false,
      validate: {
        validator: (value: string) => validator.isStrongPassword(value),
        message: 'This password is not strong enough!',
      },
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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    passwordChangedAt: Date,
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

userSchema.pre('save', async function (this: IUserDocument, next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined!;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTime = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTime;
  }
  return false;
};

userSchema.methods.correctPassword = async function (
  this: IUserDocument,
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUserDocument>('User', userSchema);

export default User;
