import express from 'express';
import clientController from '../controllers/clientController.ts';
import authController from '../controllers/authController.ts';

const router = express.Router();

router.use(authController.protect);

// ROUTES for CRUD operation
router
  .route('/')
  .get(clientController.getAllClients)
  .post(clientController.createClient);
router
  .route('/:id')
  .get(clientController.getClient)
  .patch(clientController.updateClient)
  .delete(clientController.deleteClient);

export default router;
