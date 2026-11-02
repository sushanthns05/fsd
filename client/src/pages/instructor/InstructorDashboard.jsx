import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  IndianRupee,
  Star,
  PlusCircle,
  FileCheck2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';

const revenueData = [
  { month: 'Jan', revenue: 12000, students: 24 },
  { month: 'Feb', revenue: 18500, students: 38 },
  { month: 'Mar', revenue: 26000, students: 52 },
  { month: 'Apr', revenue: 34500, students: 68 },
  { month: 'May', revenue: 42000, students: 84 },
  { month: 'Jun', revenue: 58000, students: 116 },
];

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/instructor/my-courses')
      .then((res) => {
        if (res.data?.success) setCourses(res.data.courses || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalRevenue = courses.reduce((acc, c) => acc + ((c.enrolledCount || 0) * (c.price || 0)), 0);
  const avgRating =
    courses.length > 0
      ? (courses.reduce((acc, c) => acc + (c.ratingAverage || 0), 0) / courses.length).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Instructor Studio
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome, Professor {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your courses, build interactive curricula, review assessments, and track learner growth.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="px-6 py-3.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalCourses}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Students</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalStudents}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Est. Earnings</span>
            <span className="text-sm font-bold text-indigo-600">₹</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Rating</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{avgRating}</p>
        </div>
      </div>

      {/* Revenue & Student Growth Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Revenue & Enrollment Velocity
            </h3>
            <p className="text-xs text-slate-500">Monthly instructor earnings in INR</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>Growth +38%</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Studio Courses */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            My Courses
          </h3>
          <Link
            to="/instructor/courses"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Manage All
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            You haven't authored any courses yet. Click "Create New Course" above.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-16 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold line-clamp-1">{c.title}</h4>
                    <p className="text-xs text-slate-500">
                      {c.enrolledCount || 0} students • {c.totalLessons || 0} lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      c.status === 'published'
                        ? 'success'
                        : c.status === 'pending'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {c.status}
                  </Badge>

                  <Link
                    to={`/instructor/courses/${c._id}/curriculum`}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Curriculum Builder
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
