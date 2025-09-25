import express from 'express';
import { getWorkspace, getAllWorkspaces, editWorkspace, createWorkspace, getWorkspaceByID} from '../controllers/workspaceController.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();


router.get('/', authMiddleware, getWorkspace);
router.get('/id/:workspaceID', authMiddleware, getWorkspaceByID);
router.get('/all', getAllWorkspaces);
router.patch('/edit', authMiddleware, editWorkspace);
router.post('/create', authMiddleware, createWorkspace);

export default router;
