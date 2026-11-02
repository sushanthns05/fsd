import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { Badge } from '../../components/common/Badge';

export const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in-progress' | 'completed'

  useEffect(() => {
    api.get('/enrollments/my-courses')
      .then((res) => {
        if (res.data?.success) setCourses(res.data.courses || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((item) => {
    const isDone = item.status === 'completed' || item.progress?.isCompleted;
    if (activeTab === 'completed') return isDone;
    if (activeTab === 'in-progress') return !isDone;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your course progress, watch lessons, and access certification exams.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'in-progress'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            activeTab === 'completed'
              ? 'You have not finished a course yet. Keep learning and completing lessons!'
              : 'You have not enrolled in any courses yet.'
          }
          actionLabel="Browse Catalog"
          actionLink="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((item) => {
            const course = item.course;
            const progress = item.progress || { percentCompleted: 0, isCompleted: false };

            return (
              <div
                key={item.enrollmentId}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-video w-full bg-slate-100">
                    <img
                      src={course?.thumbnail}
                      alt={course?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" size="xs">
                        {course?.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {course?.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Instructor: {course?.instructor?.name}
                    </p>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        <span>{progress.isCompleted ? 'Completed' : 'In Progress'}</span>
                        <span>{progress.percentCompleted}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progress.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${progress.percentCompleted}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-3">
                  <Link
                    to={`/learn/${course?._id}`}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm text-center flex items-center justify-center gap-2"
                  >
                    <span>{progress.isCompleted ? 'Review Course' : 'Continue Learning'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {progress.isCompleted && (
                    <Link
                      to="/student/certificates"
                      title="View Certificate"
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      <Award className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
