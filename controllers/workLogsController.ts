import WorkLogs from '../models/workLogsModel.ts';
import factory from './handlerFactory.ts';

// CRUD operation for client model
const getAllWorkLogs = factory.getAll(WorkLogs);
const getWorkLogs = factory.getOne(WorkLogs);
const createWorkLogs = factory.createOne(WorkLogs);
const updateWorkLogs = factory.updateOne(WorkLogs);
const deleteWorkLogs = factory.deleteOne(WorkLogs);

export default { getAllWorkLogs, getWorkLogs, createWorkLogs, updateWorkLogs, deleteWorkLogs };
