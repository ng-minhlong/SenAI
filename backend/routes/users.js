import express from 'express';
import { getAllUsers, deleteUser, getUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();


router.get('/', authMiddleware, getUser);
router.get('/all', getAllUsers);
router.delete('/:id', deleteUser);

export default router;
