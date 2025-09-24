import express from 'express';
import { getUsers, getUserById, deleteUser } from '../controllers/userController.js';
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;
