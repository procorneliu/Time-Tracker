import express from 'express';
import viewsController from '../controllers/viewsController.ts';
import authController from '../controllers/authController.ts';

const router = express.Router();

router.get('/', authController.protect, viewsController.getOverview);

router.get('/login', viewsController.getLogin);
router.get('/signup', viewsController.getSignup);

export default router;
