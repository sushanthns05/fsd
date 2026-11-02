import React, { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Shield, Users } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useNotifications();

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (role !== 'all') params.set('role', role);
      if (status !== 'all') params.set('status', status);
      params.set('page', page.toString());
      params.set('limit', '10');

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data?.success) {
        setUsers(res.data.users);
        setTotalUsers(res.data.total);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      toast('Failed to load user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, status, page]);

  const handleToggleStatus = async (userToToggle) => {
    if (userToToggle._id === currentUser._id) {
      toast('You cannot suspend your own administrative account.', 'warning');
      return;
    }

    try {
      const res = await api.patch(`/admin/users/${userToToggle._id}/status`);
      if (res.data?.success) {
        toast(`User has been ${res.data.user.status}.`, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === userToToggle._id ? res.data.user : u))
        );
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          User & Identity Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage learner and instructor accounts, role permissions, and access status. ({totalUsers} total)
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by full name or email address..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Administrator</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <img
                      src={
                        u.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          u.name || 'User'
                        )}`
                      }
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        u.role === 'admin'
                          ? 'danger'
                          : u.role === 'instructor'
                          ? 'primary'
                          : 'default'
                      }
                      size="xs"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="xs">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u._id !== currentUser._id && (
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          u.status === 'active'
                            ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900'
                            : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};
