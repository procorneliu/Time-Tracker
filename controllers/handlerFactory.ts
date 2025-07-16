import catchAsync from '../utils/catchAsync.ts';
import AppError from '../utils/appError.ts';
import type { Request, Response, NextFunction, RequestParamHandler } from 'express';
import { Model } from 'mongoose';

const getAll = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const documents = await Model.find();

    if (!documents) {
      return next(new AppError('No documents found!', 404));
    }

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: documents,
    });
  });
};

const getOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document) {
      return next(new AppError('No document with this ID found!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: document,
    });
  });
};

const createOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newDocument = await Model.create(req.body);

    if (!newDocument) {
      return next(
        new AppError('An error occured when creating new document. Please check details and try again!', 400),
      );
    }

    res.status(201).json({
      status: 'success',
      data: newDocument,
    });
  });
};

const updateOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!req.body) {
      return next(new AppError('Please provide information you wanna change!', 400));
    }

    const updatedDocument = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return next(new AppError('Updating document failed. Please try again!', 400));
    }

    res.status(200).json({
      status: 'success',
      data: updatedDocument,
    });
  });
};

const deleteOne = <T>(Model: Model<T>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedDocument = await Model.findByIdAndDelete(id);

    if (!deletedDocument) {
      return next(new AppError('Something got wrong, we are unable to delete this document. Try again!', 400));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

export default { getAll, getOne, createOne, updateOne, deleteOne };
