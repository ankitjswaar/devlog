import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    linkedinId: {
      type: String,
      default: null,
    },
    linkedinAccessToken: {
      type: String,
      default: null,
      select: false,
    },
    linkedinRefreshToken: {
      type: String,
      default: null,
      select: false,
    },
    linkedinTokenExpiry: {
      type: Date,
      default: null,
    },
    linkedinProfile: {
      name: String,
      picture: String,
      headline: String,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastLogDate: {
      type: Date,
      default: null,
    },
    learningDays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
