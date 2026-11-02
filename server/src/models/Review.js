import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comments'],
      trim: true,
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Static method to recalculate course average rating
reviewSchema.statics.calculateAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId, isApproved: true } },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    const Course = mongoose.model('Course');
    if (stats.length > 0) {
      await Course.findByIdAndUpdate(courseId, {
        ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
        ratingCount: stats[0].nRating,
      });
    } else {
      await Course.findByIdAndUpdate(courseId, {
        ratingAverage: 0,
        ratingCount: 0,
      });
    }
  } catch (err) {
    console.error('Error recalculating course rating:', err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.course);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.course);
  }
});

export const Review = mongoose.model('Review', reviewSchema);
