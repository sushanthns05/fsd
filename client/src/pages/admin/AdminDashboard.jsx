import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  IndianRupee,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  FileText,
  MessageSquare,
  ArrowRight,
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
import { Badge } from '../../components/common/Badge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => {
        if (res.data?.success) {
          setStats(res.data.stats);
          setRecentEnrollments(res.data.recentEnrollments || []);
          setMonthlyStats(res.data.monthlyStats || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Control Center</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor institutional metrics, approve faculty curricula, govern user security, and audit actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/courses/pending"
            className="px-5 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Pending Approvals ({stats?.pendingCourses || 0})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalStudents || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Instructors</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.totalInstructors || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Published Courses</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {stats?.publishedCourses || 0} / {stats?.totalCourses || 0}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Platform Revenue</span>
            <span className="text-sm font-bold text-indigo-600">₹</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Platform Growth Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Institutional Growth & Revenue
            </h3>
            <p className="text-xs text-slate-500">Monthly student acquisition and transaction volume</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>+42% MoM Expansion</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="url(#adminRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Enrollments
          </h3>
          <span className="text-xs text-slate-400">
            Total Enrollments: {stats?.totalEnrollments || 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-4 font-semibold">Course</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentEnrollments.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <img
                      src={
                        item.student?.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          item.student?.name || 'User'
                        )}`
                      }
                      alt={item.student?.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span>{item.student?.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {item.course?.title}
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-600">
                    {item.pricePaid > 0 ? `₹${item.pricePaid}` : 'Free'}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={item.status === 'completed' ? 'success' : 'primary'} size="xs">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(item.enrolledAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
