import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { uploadFile, editFile, getAllFiles, getFileByID, getFilesByWorkspaceID, deleteFileByID } from '../controllers/filesController.js';
import multer from 'multer';
const upload = multer();
const router = express.Router();

router.get('/id/:fileID', authMiddleware, getFileByID);
router.get('/workspaceID/:workspaceID', authMiddleware, getFilesByWorkspaceID);
router.get('/all', getAllFiles);
router.patch('/edit', authMiddleware, editFile);
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.delete('/delete/:fileID', authMiddleware, deleteFileByID);

export default router;
