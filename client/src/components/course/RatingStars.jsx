import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, count, showCount = true, size = 'sm' }) => {
  const rounded = Math.round(rating * 10) / 10;
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size] || starSizes.sm} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
        {rounded > 0 ? rounded.toFixed(1) : 'New'}
      </span>
      {showCount && count !== undefined && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({count})
        </span>
      )}
    </div>
  );
};
