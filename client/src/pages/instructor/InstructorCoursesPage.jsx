import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Trash2, Edit3, Send, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const InstructorCoursesPage = () => {
  const { toast } = useNotifications();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/instructor/my-courses');
      if (res.data?.success) setCourses(res.data.courses || []);
    } catch (err) {
      toast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmitForReview = async (id) => {
    try {
      const res = await api.post(`/courses/${id}/submit`);
      if (res.data?.success) {
        toast('Course submitted for administrator review!', 'success');
        fetchCourses();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Submission failed. Course must have at least 1 section and 1 lesson.', 'error');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all associated lessons?')) {
      return;
    }
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data?.success) {
        toast('Course deleted successfully.', 'success');
        setCourses((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published (Live)</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Course Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build, edit, and publish your educational curricula.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Course</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading courses...</div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses created yet"
          description="Begin by authoring your first draft course and adding video lessons."
          actionLabel="Create Course"
          actionLink="/instructor/courses/create"
        />
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    {getStatusBadge(course.status)}
                    <span className="text-xs font-semibold text-slate-400">
                      {course.category?.name} • {course.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{course.totalLessons || 0} lessons</span>
                    <span>{course.enrolledCount || 0} students</span>
                    <span className="font-bold text-indigo-600">
                      {course.isFree ? 'Free' : `₹${course.price}`}
                    </span>
                  </div>

                  {course.status === 'rejected' && course.rejectionReason && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 pt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Reason: {course.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <Link
                  to={`/instructor/courses/${course._id}/curriculum`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
                >
                  Curriculum Builder
                </Link>

                {course.status === 'draft' && (
                  <button
                    onClick={() => handleSubmitForReview(course._id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                )}

                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  title="Delete Course"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
