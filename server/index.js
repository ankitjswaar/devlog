import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import linkedinRoutes from './routes/linkedinRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const start = async () => {
  validateEnv();
  await connectDB();

  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/$/, '');
        const isExplicitlyAllowed = allowedOrigins.includes(normalized);
        const isVercelPreview = normalized.endsWith('.vercel.app');
        if (isExplicitlyAllowed || isVercelPreview) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'DevLog AI API is running' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/linkedin', linkedinRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Startup error:', err?.message || err);
  process.exit(1);
});
