import mongoose from 'mongoose';

const submissionFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: '1 MB' },
});

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
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
    submissionFiles: [submissionFileSchema],
    studentNotes: {
      type: String,
      default: '',
    },
    marksAwarded: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmission-required'],
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 });

export const Submission = mongoose.model('Submission', submissionSchema);
