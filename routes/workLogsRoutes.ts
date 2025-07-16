import express from 'express';
import workLogsController from '../controllers/workLogsController.ts';

const router = express.Router();

// ROUTES for CRUD operation
router.route('/').get(workLogsController.getAllWorkLogs).post(workLogsController.createWorkLogs);

router.route('/total').get(workLogsController.calculateTotalHours);

router
  .route('/:id')
  .get(workLogsController.getWorkLogs)
  .patch(workLogsController.updateWorkLogs)
  .delete(workLogsController.deleteWorkLogs);

export default router;
