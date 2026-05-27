import Post from '../models/Post.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, posts });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const totalPosts = await Post.countDocuments({ userId: req.user._id });
    const linkedInPosts = await Post.countDocuments({
      userId: req.user._id,
      postedToLinkedIn: true,
    });

    res.json({
      success: true,
      stats: {
        currentStreak: user.currentStreak,
        totalPosts,
        learningDays: user.learningDays,
        linkedInPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};
