import express from 'express';
import authController from '../controllers/authController.ts';
import userController from '../controllers/userController.ts';
import workLogsController from '../controllers/workLogsController.ts';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/me', userController.getMe);
router.get('/me/worklogs', workLogsController.getAllMyWorkLogs);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
