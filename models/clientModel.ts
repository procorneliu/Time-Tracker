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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

clientSchema.set('toJSON', {
  transform(_, ret) {
    delete ret.__v;
    return ret;
  },
});

const Client = model<IClientDocument>('Client', clientSchema);

export default Client;
