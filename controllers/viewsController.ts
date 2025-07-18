import type { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.ts';

const getOverview = catchAsync(async (req: Request, res: Response) => {
  res.status(200).render('worklogs');
});

const getLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).render('login');
});

export default { getOverview, getLogin };
