import mongoose from 'mongoose';

const attemptAnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedOptions: {
    type: [Number], // indices of selected options
    default: [],
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  marksAwarded: {
    type: Number,
    default: 0,
  },
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    answers: [attemptAnswerSchema],
    scoreAchieved: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ quiz: 1, student: 1 });

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
