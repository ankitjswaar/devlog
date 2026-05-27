import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalLog: {
      type: String,
      required: true,
    },
    generatedPost: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ['professional', 'sarcastic', 'tired'],
      required: true,
    },
    length: {
      type: String,
      enum: ['short', 'medium', 'long'],
      default: 'medium',
    },
    postedToLinkedIn: {
      type: Boolean,
      default: false,
    },
    linkedinPostId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
