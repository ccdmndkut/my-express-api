import express from 'express';
const router = express.Router();
import openaiController from '../controllers/openaiController.js';
import va from '../controllers/va.js';

router.post('/generate', openaiController);
router.get('/va', va);
router.get('/', openaiController)

export default router;