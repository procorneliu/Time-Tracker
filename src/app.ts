import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const DB_connection: string = process.env.DATABASE!.replace('<PASSWORD>', process.env.DB_PASSWORD!);
const db = await mongoose.connect(DB_connection).then(() => console.log('DB connected!'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
