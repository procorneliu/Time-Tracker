import WorkLogs from '../models/workLogsModel.ts';
import type { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.ts';
import factory from './handlerFactory.ts';

// CRUD operation for client model
const getAllWorkLogs = factory.getAll(WorkLogs);
const getWorkLogs = factory.getOne(WorkLogs);
const createWorkLogs = factory.createOne(WorkLogs);
const updateWorkLogs = factory.updateOne(WorkLogs);
const deleteWorkLogs = factory.deleteOne(WorkLogs);

const calculateTotalHours = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const allWorkLogs = await WorkLogs.find();
  const totalHours: number = allWorkLogs.reduce((acc, value) => acc + value.time, 0);

  res.status(200).json({
    status: 'success',
    data: totalHours,
  });
});

export default { getAllWorkLogs, getWorkLogs, createWorkLogs, updateWorkLogs, deleteWorkLogs, calculateTotalHours };
