import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import AppError from './utils/appError.ts';
import globalErrorHandler from './controllers/errorController.ts';

import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import userRouter from './routes/userRoutes.ts';
import clientRouter from './routes/clientRoutes.ts';
import workLogsRouter from './routes/workLogsRoutes.ts';
import viewRouter from './routes/viewsRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/worklogs', workLogsRouter);

app.all('/*splat', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
