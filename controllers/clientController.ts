import Client from '../models/clientModel.ts';
import factory from './handlerFactory.ts';

// CRUD operation for client model
const getAllClients = factory.getAll(Client);
const getClient = factory.getOne(Client);
const createClient = factory.createOne(Client);
const updateClient = factory.updateOne(Client);
const deleteClient = factory.deleteOne(Client);

export default { getAllClients, getClient, createClient, updateClient, deleteClient };
