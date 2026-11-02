import React, { useState, useEffect } from 'react';
import { FileText, Shield, Clock } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';

export const AuditLogsPage = () => {
  const { toast } = useNotifications();
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/audit-logs?page=${page}&limit=15`)
      .then((res) => {
        if (res.data?.success) {
          setLogs(res.data.logs || []);
          setTotalPages(res.data.totalPages || 1);
        }
      })
      .catch(() => toast('Failed to load audit logs', 'error'))
      .finally(() => setLoading(false));
  }, [page, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Platform Security & Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cryptographically recorded administrative and compliance operations.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Admin Account</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Entity Type</th>
                <th className="py-3 px-4 font-semibold">Details</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {log.admin?.name || 'System Admin'}
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {log.admin?.email}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="primary" size="xs">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {log.entityType}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                    {JSON.stringify(log.details)}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
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
