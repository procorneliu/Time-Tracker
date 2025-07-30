import type { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.ts';
import returnUrl from '../utils/returnUrl.ts';
import type { extendedRequest } from './authController.ts';

const getOverview = catchAsync(async (req: extendedRequest, res: Response) => {
  res.status(200).render('worklogs', { username: req.user!.name });
});

const getLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // if user already logged in, go to dashboard
    if (req.cookies.jwt) {
      res.redirect(`http://${returnUrl()}/`);
    } else {
      res.status(200).render('login');
    }
  },
);

const getSignup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // if user already logged in, go to dashboard
    if (req.cookies.jwt) {
      res.redirect(`http://${returnUrl()}/`);
    } else {
      res.status(200).render('signup');
    }
  },
);

export default { getOverview, getLogin, getSignup };
