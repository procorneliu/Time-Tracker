import express from 'express';
import viewsController from '../controllers/viewsController.ts';

const router = express.Router();

router.get('/', viewsController.getOverview);

export default router;
