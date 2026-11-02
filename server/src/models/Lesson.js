import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, default: 'pdf' },
  fileSize: { type: String, default: '1 MB' },
});

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
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
    type: {
      type: String,
      enum: ['video', 'article', 'pdf'],
      default: 'video',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    videoDurationSeconds: {
      type: Number,
      default: 0,
    },
    contentBody: {
      type: String,
      default: '',
    },
    resources: [resourceSchema],
    isPreviewAllowed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ section: 1, orderIndex: 1 });
lessonSchema.index({ course: 1 });

export const Lesson = mongoose.model('Lesson', lessonSchema);
