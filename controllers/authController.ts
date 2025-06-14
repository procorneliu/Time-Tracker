import jwt, { type SignOptions } from 'jsonwebtoken';
import User, { type IUserDocument } from '../models/userModel.ts';
import catchAsync from '../utils/catchAsync.ts';
import AppError from '../utils/appError.ts';
import type { Types } from 'mongoose';
import type { NextFunction, Request, Response } from 'express';

const signToken = (id: Types.ObjectId): string | AppError => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret || !expiresIn) {
    return new AppError('Something wrong!', 400);
  }

  const payload = { id };
  const options = { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] };

  return jwt.sign(payload, secret, options);
};

const createSendToken = (user: IUserDocument, statusCode: number, req: Request, res: Response) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, req, res);
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

export default { signup, login };
