import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Search, Download, Calendar, User, BookOpen } from 'lucide-react';
import api from '../../services/api';

export const VerifyCertificatePage = () => {
  const { certificateId: paramId } = useParams();
  const [certIdInput, setCertIdInput] = useState(paramId || '');
  const [certData, setCertData] = useState(null);
  const [status, setStatus] = useState(paramId ? 'loading' : 'idle'); // 'idle' | 'loading' | 'valid' | 'invalid'
  const [errorMsg, setErrorMsg] = useState('');

  const verifyId = async (idToVerify) => {
    if (!idToVerify.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await api.get(`/certificates/verify/${idToVerify.trim()}`);
      if (res.data?.isValid) {
        setCertData(res.data.certificate);
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    } catch (err) {
      setStatus('invalid');
      setErrorMsg(err.response?.data?.message || 'Certificate ID was not found in the public ledger.');
    }
  };

  useEffect(() => {
    if (paramId) {
      verifyId(paramId);
    }
  }, [paramId]);

  const handleSearch = (e) => {
    e.preventDefault();
    verifyId(certIdInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          EduSphere Credential Verification
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Verify the authenticity and completion standards of any certificate issued by the EduSphere Academic Board.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-lg mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={certIdInput}
            onChange={(e) => setCertIdInput(e.target.value)}
            placeholder="Enter Certificate ID (e.g. EDU-2026-XXXX)"
            className="w-full pl-4 pr-28 py-3.5 rounded-2xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider font-mono"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Verify
          </button>
        </div>
      </form>

      {/* Results */}
      {status === 'loading' && (
        <div className="p-12 text-center text-sm text-slate-500 animate-pulse">
          Querying EduSphere verification registry...
        </div>
      )}

      {status === 'invalid' && (
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 mx-auto flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
            Certificate Not Found
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300 max-w-sm mx-auto">
            {errorMsg || 'The specified credential could not be authenticated. Please double-check the ID or contact the issuing student.'}
          </p>
        </div>
      )}

      {status === 'valid' && certData && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Authentic Credential
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {certData.certificateId}
                </h3>
              </div>
            </div>

            {certData.pdfUrl && (
              <a
                href={certData.pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Student Name
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {certData.studentName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Course Title
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {certData.courseTitle}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Issue Date
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {new Date(certData.issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
            This credential verifies that the recipient has satisfied all course curriculum milestones and passed the required examination on EduSphere.
          </div>
        </div>
      )}
    </div>
  );
};
