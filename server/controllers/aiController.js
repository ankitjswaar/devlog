import Post from '../models/Post.js';
import User from '../models/User.js';
import { buildGenerationPrompt } from '../utils/prompts.js';
import { AppError } from '../middleware/errorHandler.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
].filter(Boolean);

const getGeminiModels = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];
  const genAI = new GoogleGenerativeAI(apiKey);
  return GEMINI_MODELS.map((name) => genAI.getGenerativeModel({ model: name }));
};

const generateWithGemini = async (prompt) => {
  const models = getGeminiModels();
  if (!models.length) return null;

  let lastError;
  for (const model of models) {
    try {
      const result = await model.generateContent(prompt);
      const text = result?.response?.text()?.trim();
      if (text) return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No Gemini model available');
};

const updateStreak = (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastLogDate) {
    user.currentStreak = 1;
    user.learningDays = 1;
  } else {
    const last = new Date(user.lastLogDate);
    last.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // same day, no streak change
    } else if (diffDays === 1) {
      user.currentStreak += 1;
      user.learningDays += 1;
    } else {
      user.currentStreak = 1;
      user.learningDays += 1;
    }
  }

  user.lastLogDate = new Date();
  return user;
};

export const generatePost = async (req, res, next) => {
  try {
    const { notes, tone, length } = req.body;

    if (!notes?.trim()) {
      throw new AppError('Please provide your learning notes', 400);
    }

    const validTones = ['professional', 'sarcastic', 'tired'];
    const validLengths = ['short', 'medium', 'long'];
    const selectedTone = validTones.includes(tone) ? tone : 'professional';
    const selectedLength = validLengths.includes(length) ? length : 'medium';

    if (!process.env.GEMINI_API_KEY) {
      throw new AppError('Gemini API key not configured', 500);
    }

    const prompt = buildGenerationPrompt(notes.trim(), selectedTone, selectedLength);
    const generatedPost = await generateWithGemini(prompt);

    if (!generatedPost) {
      throw new AppError('Failed to generate post', 500);
    }

    const post = await Post.create({
      userId: req.user._id,
      originalLog: notes.trim(),
      generatedPost,
      tone: selectedTone,
      length: selectedLength,
    });

    const user = await User.findById(req.user._id);
    updateStreak(user);
    await user.save();

    res.json({
      success: true,
      post: {
        id: post._id,
        originalLog: post.originalLog,
        generatedPost: post.generatedPost,
        tone: post.tone,
        length: post.length,
        postedToLinkedIn: post.postedToLinkedIn,
        createdAt: post.createdAt,
      },
      stats: {
        currentStreak: user.currentStreak,
        learningDays: user.learningDays,
      },
    });
  } catch (error) {
    const message = error?.message || 'Failed to generate post';
    if (message.includes('429') || message.includes('quota')) {
      return next(new AppError('Gemini rate limit reached. Wait a minute and try again.', 429));
    }
    if (message.includes('API key') || message.includes('403')) {
      return next(new AppError('Invalid Gemini API key. Check GEMINI_API_KEY in server/.env', 500));
    }
    next(error);
  }
};
