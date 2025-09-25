import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { getAllMemberships, getMembership } from '../controllers/membershipController.js';
const router = express.Router();


router.get('/', authMiddleware, getMembership);
router.get('/all', getAllMemberships);

export default router;
