import type { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.ts';
import User from '../models/userModel.ts';
import factory from './handlerFactory.ts';
import type { extendedRequest } from './authController.ts';
import AppError from '../utils/appError.ts';

// CRUD operations for users
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const createUser = factory.createOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

const getMe = catchAsync(
  async (req: extendedRequest, res: Response, next: NextFunction) => {
    const currentUser = await User.findById(req.user!.id);

    if (!currentUser) return next(new AppError('Please log in again!', 401));

    res.status(200).json({
      status: 'success',
      data: currentUser,
    });
  },
);

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
};
