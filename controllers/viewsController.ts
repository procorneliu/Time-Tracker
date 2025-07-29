import type { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.ts';

const getOverview = catchAsync(async (req: Request, res: Response) => {
  res.status(200).render('worklogs');
});

const getLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.jwt) {
      res.redirect('http://localhost:3000/');
    } else {
      res.status(200).render('login');
    }
  },
);

const getSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).render('signup');
  },
);

export default { getOverview, getLogin, getSignup };
