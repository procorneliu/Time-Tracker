import type { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync.ts';

const getOverview = catchAsync(async (req: Request, res: Response) => {
  res.status(200).render('index', {
    title: 'Hello man',
  });
});

export default { getOverview };
