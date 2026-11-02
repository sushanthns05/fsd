import React, { useState, useEffect } from 'react';
import { Award, Download, ExternalLink, CheckCircle2, Copy } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';

export const CertificatesPage = () => {
  const { toast } = useNotifications();
  const [certificates, setCertificates] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certRes, coursesRes] = await Promise.all([
          api.get('/certificates/my-certificates'),
          api.get('/enrollments/my-courses'),
        ]);

        if (certRes.data?.success) setCertificates(certRes.data.certificates || []);
        if (coursesRes.data?.success) {
          // Find courses completed but without a certificate in the certificates list
          const certCourseIds = (certRes.data?.certificates || []).map(
            (c) => c.course?._id || c.course
          );
          const claimable = (coursesRes.data?.courses || []).filter(
            (c) =>
              (c.progress?.isCompleted || c.progress?.percentCompleted === 100) &&
              !certCourseIds.includes(c.course?._id)
          );
          setCompletedCourses(claimable);
        }
      } catch (err) {
        toast('Failed to load certificates', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleClaimCertificate = async (courseId) => {
    setGenerating(true);
    try {
      const res = await api.post('/certificates/generate', { courseId });
      if (res.data?.success) {
        toast('Certificate generated successfully!', 'success');
        setCertificates((prev) => [res.data.certificate, ...prev]);
        setCompletedCourses((prev) => prev.filter((c) => c.course?._id !== courseId));
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to claim certificate', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const copyVerifyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast('Public verification URL copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Accredited Certificates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, download, and share your verifiable credentials.
        </p>
      </div>

      {/* Claimable section (if student completed 100% of a course) */}
      {completedCourses.length > 0 && (
        <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-700 dark:text-indigo-300">
            <Award className="w-5 h-5" />
            <h3 className="text-sm font-bold">You have unissued certificates available!</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedCourses.map((c) => (
              <div
                key={c.course?._id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold line-clamp-1">{c.course?.title}</h4>
                  <p className="text-[11px] text-emerald-600 font-semibold">100% Completed</p>
                </div>
                <button
                  onClick={() => handleClaimCertificate(c.course?._id)}
                  disabled={generating}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Issue Certificate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates earned yet"
          description="Complete 100% of all lessons in an enrolled course to unlock your verified credential."
          actionLabel="Go to My Courses"
          actionLink="/student/my-courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                    {cert.certificateId}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Instructor: {cert.instructorName}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyVerifyLink(cert.verificationUrl)}
                    title="Copy verification link"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <a
                    href={`/verify/${cert.certificateId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public Ledger</span>
                  </a>
                </div>

                {cert.pdfUrl && (
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
