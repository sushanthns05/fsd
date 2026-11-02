import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, BookOpen, Clock, Users } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const CourseApprovalPage = () => {
  const { toast } = useNotifications();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal
  const [rejectingCourse, setRejectingCourse] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/courses/pending');
      if (res.data?.success) {
        setCourses(res.data.courses || []);
      }
    } catch (err) {
      toast('Failed to load pending courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const handleApprove = async (courseId) => {
    try {
      const res = await api.patch(`/admin/courses/${courseId}/approval`, {
        action: 'approve',
      });
      if (res.data?.success) {
        toast('Course approved and published live!', 'success');
        setCourses((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Approval failed', 'error');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectingCourse) return;

    setActionLoading(true);
    try {
      const res = await api.patch(`/admin/courses/${rejectingCourse._id}/approval`, {
        action: 'reject',
        rejectionReason,
      });
      if (res.data?.success) {
        toast('Course rejected and feedback dispatched to instructor.', 'info');
        setCourses((prev) => prev.filter((c) => c._id !== rejectingCourse._id));
        setRejectingCourse(null);
        setRejectionReason('');
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Rejection failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Curriculum Quality & Approval
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review courses submitted by faculty members to ensure compliance with EduSphere pedagogical standards.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading pending courses...</div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All caught up!"
          description="There are currently no courses pending administrative review."
        />
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-28 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="xs">
                      Pending Review
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold">
                      {course.category?.name} • {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                    {course.subtitle || course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>Instructor: {course.instructor?.name} ({course.instructor?.email})</span>
                    <span>{course.totalLessons || 0} lessons</span>
                    <span className="font-bold text-indigo-600">
                      {course.isFree ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setRejectingCourse(course)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleApprove(course._id)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingCourse && (
        <Modal
          isOpen={!!rejectingCourse}
          onClose={() => setRejectingCourse(null)}
          title={`Reject Course: ${rejectingCourse.title}`}
        >
          <form onSubmit={handleReject} className="space-y-4">
            <p className="text-xs text-slate-500">
              Provide constructive feedback to help the instructor address gaps before resubmitting.
            </p>
            <div>
              <label className="block text-xs font-semibold mb-1">Reason for Rejection *</label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please add higher resolution video recordings and at least one practical coding exercise in Module 2..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
