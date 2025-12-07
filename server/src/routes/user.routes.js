import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/', UserController.getAllUsers);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;