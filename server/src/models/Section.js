import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ course: 1, orderIndex: 1 });

export const Section = mongoose.model('Section', sectionSchema);
