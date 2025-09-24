import express from 'express';
import { getUsers, getUserById, deleteUser, getProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();


router.get('/profile', authMiddleware, getProfile);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;
