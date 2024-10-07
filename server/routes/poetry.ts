import express from 'express';
import { getPoems, getPoemById, createPoem, deletePoem } from '../controllers/PoetryController';

const router = express.Router();

// Corrected route definitions
router.get('/poetry', getPoems);
router.get('/poetry/:id', getPoemById);  // Fixed route
router.post('/poetry', createPoem);
router.delete('/poetry/:id', deletePoem);  // Fixed route

export default router;
