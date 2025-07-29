import mongoose from 'mongoose';

const DB_connection: string = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD!,
);
await mongoose.connect(DB_connection).then(() => console.log('DB connected!'));
