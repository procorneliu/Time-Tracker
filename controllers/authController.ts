import jwt, { type JwtPayload } from 'jsonwebtoken';
import User, { type IUserDocument } from '../models/userModel.ts';
import catchAsync from '../utils/catchAsync.ts';
import AppError from '../utils/appError.ts';
import type { Types } from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import { promisify } from 'util';

export interface extendedRequest extends Request {
  user?: IUserDocument;
}

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
  const token = signToken(user.id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + Number(process.env.JWT_COOKIES_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: 'lax',
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
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

const protect = catchAsync(async (req: extendedRequest, res: Response, next: NextFunction) => {
  // 1) Getting token and check if exists
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('Please log in to get access', 401));
  // 2) Token verification
  const verifyAsync = promisify(jwt.verify) as (
    token: string,
    secretOrPublicKey: jwt.Secret,
  ) => Promise<string | JwtPayload>;

  const decoded = (await verifyAsync(token, process.env.JWT_SECRET as string)) as JwtPayload;

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('The user belonging to this user does no longer exists', 401));

  // 4) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat!)) {
    return next(new AppError('Password was changed. Please log in again!', 401));
  }

  // GRANT ACCESS
  req.user = currentUser;
  next();
});

const restrictTo = (...roles: [string]) => {
  return (req: extendedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      return next(new AppError("You don't have permissions to perform this action", 403));
    }

    next();
  };
};

export default { signup, login, protect, restrictTo };
