import express from 'express';
import { getProfile, getAllProfiles, editProfile } from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();


router.get('/', authMiddleware, getProfile);
router.get('/all', getAllProfiles);
router.patch('/edit', authMiddleware, editProfile);

export default router;
