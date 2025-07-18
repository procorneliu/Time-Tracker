import { Schema, model, Document } from 'mongoose';
import type { IClientDocument } from './clientModel.ts';
import type { IUserDocument } from './userModel.ts';

interface IWorkLogs {
  title: string;
  time: number;
  rate?: number;
  owner: IUserDocument;
  client: IClientDocument;
}

export interface IWorkLogsDocument extends IWorkLogs, Document {}

const workLogsSchema: Schema = new Schema<IWorkLogsDocument>(
  {
    title: {
      type: String,
      required: [true, 'A project/work must have a title'],
    },
    time: {
      type: Number,
      required: true,
      minlength: 1,
    },
    rate: {
      type: Number,
      min: 1,
    },
    owner: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'a work/project must belong to a client'],
    },
    client: {
      type: Schema.ObjectId,
      ref: 'Client',
      required: [true, 'a work/project must belong to a client'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

const WorkLogs = model<IWorkLogsDocument>('WorkLogs', workLogsSchema);

export default WorkLogs;
