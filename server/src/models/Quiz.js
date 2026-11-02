import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    durationMinutes: {
      type: Number,
      default: 15, // 0 for untimed
      min: 0,
    },
    passingPercentage: {
      type: Number,
      default: 70,
      min: 1,
      max: 100,
    },
    maxAttempts: {
      type: Number,
      default: 3, // 0 for unlimited
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
