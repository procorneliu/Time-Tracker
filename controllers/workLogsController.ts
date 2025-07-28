import WorkLogs from '../models/workLogsModel.ts';
import type { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.ts';
import factory from './handlerFactory.ts';
import type { extendedRequest } from './authController.ts';
import AppError from '../utils/appError.ts';

// CRUD operation for client model
const getAllWorkLogs = factory.getAll(WorkLogs, true);
const getWorkLogs = factory.getOne(WorkLogs);
const createWorkLogs = factory.createOne(WorkLogs, true);
const updateWorkLogs = factory.updateOne(WorkLogs);
const deleteWorkLogs = factory.deleteOne(WorkLogs);

const getAllMyWorkLogs = catchAsync(
  async (req: extendedRequest, res: Response, next: NextFunction) => {
    const myWorkLogs = await WorkLogs.find({ owner: req.user!.id }).populate(
      'client',
    );

    if (!myWorkLogs) return next(new AppError('No WorkLogs found!', 404));

    res.status(200).json({
      status: 'success',
      data: myWorkLogs,
    });
  },
);

const calculateTotalHours = catchAsync(
  async (req: extendedRequest, res: Response, next: NextFunction) => {
    const allMyWorkLogs = await WorkLogs.find({ owner: req.user!.id });

    const totalHours: number = allMyWorkLogs.reduce(
      (acc, value) => acc + value.time,
      0,
    );

    res.status(200).json({
      status: 'success',
      data: totalHours,
    });
  },
);

export default {
  getAllWorkLogs,
  getWorkLogs,
  createWorkLogs,
  updateWorkLogs,
  deleteWorkLogs,
  getAllMyWorkLogs,
  calculateTotalHours,
};
