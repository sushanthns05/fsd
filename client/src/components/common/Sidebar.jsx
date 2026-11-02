import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  FileCheck2,
  User,
  PlusCircle,
  Users,
  ShieldCheck,
  FolderTree,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  let navItems = [];

  if (user?.role === 'admin') {
    navItems = [
      { label: 'Control Center', path: '/admin', icon: LayoutDashboard },
      { label: 'User Directory', path: '/admin/users', icon: Users },
      { label: 'Course Approvals', path: '/admin/courses/pending', icon: ShieldCheck },
      { label: 'Categories', path: '/admin/categories', icon: FolderTree },
      { label: 'Review Moderation', path: '/admin/reviews', icon: MessageSquare },
      { label: 'Audit Trail', path: '/admin/audit-logs', icon: FileText },
    ];
  } else if (user?.role === 'instructor') {
    navItems = [
      { label: 'Studio Overview', path: '/instructor', icon: LayoutDashboard },
      { label: 'My Courses', path: '/instructor/courses', icon: BookOpen },
      { label: 'Create Course', path: '/instructor/courses/create', icon: PlusCircle },
      { label: 'Grading Portal', path: '/instructor/submissions', icon: FileCheck2 },
      { label: 'Account Profile', path: '/student/profile', icon: User },
    ];
  } else {
    navItems = [
      { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { label: 'My Courses', path: '/student/my-courses', icon: BookOpen },
      { label: 'Assignments', path: '/student/assignments', icon: FileCheck2 },
      { label: 'Certificates', path: '/student/certificates', icon: Award },
      { label: 'My Profile', path: '/student/profile', icon: User },
    ];
  }

  return (
    <aside
      className={`border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 flex flex-col justify-between shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4">
        {/* User Card */}
        <div
          className={`flex items-center gap-3 p-3 mb-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.name || 'User'
              )}`
            }
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name}
              </p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {user?.role}
              </span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/instructor' || item.path === '/student'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Collapse toggle at bottom */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
