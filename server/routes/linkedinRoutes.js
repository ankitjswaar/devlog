import express from 'express';
import {
  getAuthUrl,
  handleCallback,
  getProfile,
  postToLinkedIn,
  disconnectLinkedIn,
} from '../controllers/linkedinController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/callback', handleCallback);
router.get('/auth-url', protect, getAuthUrl);
router.get('/profile', protect, getProfile);
router.post('/post', protect, postToLinkedIn);
router.delete('/disconnect', protect, disconnectLinkedIn);

export default router;
