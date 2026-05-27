import express from 'express';
import { getPosts, getStats, getPostById } from '../controllers/postController.js';
import { generatePost } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/generate', generatePost);

export default router;
