import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  lastPositionSeconds: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
});

const progressSchema = new mongoose.Schema(
  {
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
      index: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    lessonProgress: [lessonProgressSchema],
    percentCompleted: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

export const Progress = mongoose.model('Progress', progressSchema);
