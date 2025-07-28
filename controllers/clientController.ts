import Client from '../models/clientModel.ts';
import AppError from '../utils/appError.ts';
import catchAsync from '../utils/catchAsync.ts';
import factory from './handlerFactory.ts';
import type { extendedRequest } from './authController.ts';
import type { Request, Response, NextFunction } from 'express';

// CRUD operation for client model
const getAllClients = factory.getAll(Client);
const getClient = factory.getOne(Client);
const createClient = factory.createOne(Client, true);
const updateClient = factory.updateOne(Client);
const deleteClient = factory.deleteOne(Client);

const getAllMyClients = catchAsync(
  async (req: extendedRequest, res: Response, next: NextFunction) => {
    const allMyClients = await Client.find({ owner: req.user!.id });

    if (!allMyClients) return next(new AppError('No clients found', 404));

    res.status(200).json({
      status: 'success',
      data: allMyClients,
    });
  },
);

export default {
  getAllClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getAllMyClients,
};
