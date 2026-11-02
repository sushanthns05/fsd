import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Users } from 'lucide-react';
import { Badge } from '../common/Badge';
import { RatingStars } from './RatingStars';

export const CourseCard = ({ course }) => {
  const formatPrice = (price, isFree) => {
    if (isFree || price === 0) {
      return <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">FREE</span>;
    }
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
          ₹{price.toLocaleString('en-IN')}
        </span>
        {course.discountPrice > 0 && (
          <span className="text-xs text-slate-400 line-through">
            ₹{course.discountPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    );
  };

  const getDifficultyVariant = (diff) => {
    switch (diff) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Course Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={getDifficultyVariant(course.difficulty)} size="xs">
              {course.difficulty}
            </Badge>
            {course.category?.name && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-sm shadow-sm">
                {course.category.name}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <Link to={`/courses/${course.slug}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {course.subtitle || course.description}
          </p>

          {/* Rating */}
          <div className="mb-4">
            <RatingStars rating={course.ratingAverage} count={course.ratingCount} />
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.totalDurationMinutes} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{course.enrolledCount} enrolled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Instructor & Price */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={
              course.instructor?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                course.instructor?.name || 'Instructor'
              )}`
            }
            alt={course.instructor?.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
            {course.instructor?.name}
          </span>
        </div>

        <div>{formatPrice(course.price, course.isFree)}</div>
      </div>
    </div>
  );
};
