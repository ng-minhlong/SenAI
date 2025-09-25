import express from 'express';
import { getAddress, getAllAddresss, editAddress } from '../controllers/addressController.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();


router.get('/', authMiddleware, getAddress);
router.get('/all', getAllAddresss);
router.patch('/edit', authMiddleware, editAddress);

export default router;
