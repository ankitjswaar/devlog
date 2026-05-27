import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Please provide name, email, and password', 400);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already registered', 400);
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        linkedinConnected: !!user.linkedinId,
        linkedinProfile: user.linkedinProfile,
        currentStreak: user.currentStreak,
        learningDays: user.learningDays,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        linkedinConnected: !!user.linkedinId,
        linkedinProfile: user.linkedinProfile,
        currentStreak: user.currentStreak,
        learningDays: user.learningDays,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        linkedinConnected: !!user.linkedinId,
        linkedinProfile: user.linkedinProfile,
        currentStreak: user.currentStreak,
        learningDays: user.learningDays,
      },
    });
  } catch (error) {
    next(error);
  }
};
