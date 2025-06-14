import './utils/dotenv.ts';
import './utils/db.ts';
import AppError from './utils/appError.ts';

import express, { type NextFunction, type Request, type Response } from 'express';

import userRouter from './routes/userRoutes.ts';
import clientRouter from './routes/clientRoutes.ts';
import workLogsRouter from './routes/workLogsRoutes.ts';

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/worklogs', workLogsRouter);

app.all('/*splat', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
