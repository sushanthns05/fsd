import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['single-choice', 'multiple-choice'],
      default: 'single-choice',
    },
    options: {
      type: [optionSchema],
      validate: [
        (val) => val.length >= 2,
        'Question must have at least 2 options',
      ],
    },
    explanation: {
      type: String,
      default: '',
    },
    marks: {
      type: Number,
      default: 10,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

questionSchema.index({ quiz: 1, orderIndex: 1 });

export const Question = mongoose.model('Question', questionSchema);
