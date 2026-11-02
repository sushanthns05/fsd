import mongoose from 'mongoose';

const referenceFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String, default: '500 KB' },
});

const assignmentSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    totalMarks: {
      type: Number,
      default: 100,
    },
    passingMarks: {
      type: Number,
      default: 50,
    },
    deadline: {
      type: Date,
    },
    referenceFiles: [referenceFileSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);
