import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Star, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { RatingStars } from '../../components/course/RatingStars';
import { EmptyState } from '../../components/common/EmptyState';

export const ReviewModerationPage = () => {
  const { toast } = useNotifications();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/admin/reviews');
      if (res.data?.success) setReviews(res.data.reviews || []);
    } catch (err) {
      toast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently? This action will be audited.')) return;
    try {
      const res = await api.delete(`/admin/reviews/${id}`);
      if (res.data?.success) {
        toast('Review moderated and removed.', 'success');
        setReviews((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to remove review', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Review Moderation & Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor course reviews and remove inappropriate content or spam.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews found"
          description="There are currently no reviews on the platform."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      rev.student?.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        rev.student?.name || 'User'
                      )}`
                    }
                    alt={rev.student?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {rev.student?.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      On course: <span className="font-semibold">{rev.course?.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} showCount={false} />
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  "{rev.comment}"
                </p>
              </div>

              <button
                onClick={() => handleDeleteReview(rev._id)}
                title="Moderate & Remove"
                className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors self-end sm:self-center shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
