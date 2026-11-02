import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
    },
    language: {
      type: String,
      default: 'English',
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be 0 or positive'],
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    },
    trailerVideoUrl: {
      type: String,
      default: '',
    },
    objectives: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'draft',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    totalDurationMinutes: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

courseSchema.index({ status: 1, category: 1, difficulty: 1, price: 1 });
courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model('Course', courseSchema);
