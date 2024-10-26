// routes/translationRoutes.ts
import express from 'express';
import multer from 'multer';
import {uploadPDF, streamPDF, getAllTranslations, deleteTranslation} from '../controllers/TranslationController';

const router = express.Router();
const upload = multer(); // Set multer to handle file upload

router.post('/upload', upload.single('pdf'), uploadPDF);
router.get('/stream/:id', streamPDF);
router.get('/all', getAllTranslations);
router.delete('/delete/:id', deleteTranslation);

export default router;
