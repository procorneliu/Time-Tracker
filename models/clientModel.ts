import { Schema, model, Document } from 'mongoose';
import type { IUserDocument } from './userModel.ts';

interface IClient {
  name: string;
  owner: IUserDocument;
}

export interface IClientDocument extends IClient, Document {}

const clientSchema: Schema = new Schema<IClientDocument>(
  {
    name: {
      type: String,
      required: [true, 'Client must have a name!'],
      trim: true,
    },
    owner: {
      type: Schema.ObjectId,
      ref: 'User',
      required: [true, 'a client must have a user'],
    },
  },
  {
    versionKey: false,
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

const Client = model<IClientDocument>('Client', clientSchema);

export default Client;
