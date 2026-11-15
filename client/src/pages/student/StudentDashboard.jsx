import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';

const activityData = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 70 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 90 },
  { day: 'Fri', minutes: 60 },
  { day: 'Sat', minutes: 120 },
  { day: 'Sun', minutes: 85 },
];

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, certRes, gradeRes] = await Promise.all([
          api.get('/enrollments/my-courses'),
          api.get('/certificates/my-certificates'),
          api.get('/assignments/my/grades').catch(() => ({ data: null })),
        ]);
        if (courseRes.data?.success) setCourses(courseRes.data.courses || []);
        if (certRes.data?.success) setCertificates(certRes.data.certificates || []);
        if (gradeRes?.data?.success) setGradeData(gradeRes.data);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalEnrolled = courses.length;
  const completedCourses = courses.filter((c) => c.status === 'completed' || c.progress?.isCompleted).length;
  const inProgressCourses = totalEnrolled - completedCourses;
  const activeCourse = courses.find((c) => !c.progress?.isCompleted) || courses[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Student Learning Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-indigo-100 leading-relaxed">
            You've completed {completedCourses} out of {totalEnrolled} courses. Continue your progress towards industry certification!
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalEnrolled}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{inProgressCourses}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{completedCourses}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Certifications</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{certificates.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Cumulative GPA</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {gradeData?.stats?.cumulativeGPA !== undefined ? `${gradeData.stats.cumulativeGPA.toFixed(2)}` : '4.00'}
            </p>
            {gradeData?.stats?.overallGrade && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {gradeData.stats.overallGrade}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Continue Learning Callout + Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
              Next Up
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Resume Learning
            </h3>

            {activeCourse ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={activeCourse.course?.thumbnail}
                    alt={activeCourse.course?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white/90" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {activeCourse.course?.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeCourse.course?.instructor?.name}
                  </p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{activeCourse.progress?.percentCompleted || 0}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${activeCourse.progress?.percentCompleted || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                You have no active courses yet. Browse the catalog to begin learning.
              </p>
            )}
          </div>

          <div className="pt-6">
            {activeCourse ? (
              <Link
                to={`/learn/${activeCourse.course?._id}`}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Jump to Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/courses"
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Courses</span>
              </Link>
            )}
          </div>
        </div>

        {/* Weekly Study Activity Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Study Velocity
              </h3>
              <p className="text-xs text-slate-500">Minutes spent learning this week</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span>+24% vs last week</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMin)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Enrolled Courses preview table / list */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            My Enrolled Paths
          </h3>
          <Link
            to="/student/my-courses"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            View all ({totalEnrolled})
          </Link>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title="No enrollments yet"
            description="Start building your skill set by enrolling in any of our top courses."
            actionLabel="Explore Courses"
            actionLink="/courses"
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {courses.slice(0, 4).map((item) => (
              <div
                key={item.enrollmentId}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.course?.thumbnail}
                    alt={item.course?.title}
                    className="w-16 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {item.course?.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {item.course?.instructor?.name} • {item.course?.difficulty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-28 text-right sm:text-left">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {item.progress?.percentCompleted || 0}% Completed
                    </span>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${item.progress?.percentCompleted || 0}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/learn/${item.course?._id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic Grade Points & Project Evaluations */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-0.5">
              Accredited Evaluations
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Grade Points & Capstone Evaluations
            </h3>
          </div>
          <Link
            to="/student/assignments"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>All Assignments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!gradeData?.grades || gradeData.grades.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              No graded assignments yet. Submit course capstone projects to accumulate grade points.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gradeData.grades.map((grade) => (
              <div
                key={grade._id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 transition-all hover:border-indigo-200 dark:hover:border-indigo-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={grade.courseThumbnail}
                      alt={grade.courseTitle}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 line-clamp-1">
                        {grade.courseTitle}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {grade.assignmentTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {grade.letterGrade} • {grade.gradePoints.toFixed(1)} GP
                    </span>
                    <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-1">
                      {grade.marksAwarded} / {grade.totalMarks} ({grade.percentage}%)
                    </p>
                  </div>
                </div>

                {grade.feedback && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 italic">
                    "{grade.feedback}"
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Instructor: {grade.gradedBy}</span>
                  {grade.gradedAt && (
                    <span>Evaluated {new Date(grade.gradedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
