import { Schema, model, Document } from 'mongoose';
import type { IClientDocument } from './clientModel.ts';

interface IWorkLogs {
  title: string;
  rate?: number;
  client: IClientDocument;
}

export interface IWorkLogsDocument extends IWorkLogs, Document {}

const workLogsSchema: Schema = new Schema<IWorkLogsDocument>(
  {
    title: {
      type: String,
      required: [true, 'A project/work must have a title'],
    },
    rate: {
      type: Number,
      min: 1,
    },
    client: {
      type: Schema.ObjectId,
      ref: 'Client',
      required: [true, 'a work/project must belong to a client'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

workLogsSchema.set('toJSON', {
  transform(_, ret) {
    delete ret.__v;
    return ret;
  },
});

const WorkLogs = model<IClientDocument>('WorkLogs', workLogsSchema);

export default WorkLogs;
