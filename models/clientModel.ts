import { Schema, model, Document } from 'mongoose';

interface IClient {
  name: string;
}

export interface IClientDocument extends IClient, Document {}

const clientSchema: Schema = new Schema<IClientDocument>(
  {
    name: {
      type: String,
      required: [true, 'Client must have a name!'],
      trim: true,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Client = model<IClientDocument>('Client', clientSchema);

export default Client;
