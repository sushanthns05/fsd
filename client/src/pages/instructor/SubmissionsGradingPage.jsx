import React, { useState, useEffect } from 'react';
import { FileCheck2, User, Award, CheckCircle2, MessageSquare, Download } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const SubmissionsGradingPage = () => {
  const { toast } = useNotifications();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grade Modal state
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [marksAwarded, setMarksAwarded] = useState(100);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('graded');
  const [saving, setSaving] = useState(false);

  // Load instructor courses
  useEffect(() => {
    api.get('/courses/instructor/my-courses').then((res) => {
      if (res.data?.success && res.data.courses.length > 0) {
        setCourses(res.data.courses);
        setSelectedCourseId(res.data.courses[0]._id);
      }
      setLoading(false);
    });
  }, []);

  // Load assignments when course changes
  useEffect(() => {
    if (!selectedCourseId) return;
    api.get(`/assignments/courses/${selectedCourseId}`).then((res) => {
      if (res.data?.success) {
        setAssignments(res.data.assignments || []);
        if (res.data.assignments.length > 0) {
          setSelectedAssignmentId(res.data.assignments[0]._id);
        } else {
          setSelectedAssignmentId('');
          setSubmissions([]);
        }
      }
    });
  }, [selectedCourseId]);

  // Load submissions when assignment changes
  useEffect(() => {
    if (!selectedAssignmentId) return;
    api.get(`/assignments/${selectedAssignmentId}/submissions`).then((res) => {
      if (res.data?.success) {
        setSubmissions(res.data.submissions || []);
      }
    });
  }, [selectedAssignmentId]);

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    setSaving(true);
    try {
      const res = await api.patch(
        `/assignments/submissions/${gradingSubmission._id}/grade`,
        { marksAwarded: Number(marksAwarded), feedback, status }
      );

      if (res.data?.success) {
        toast('Submission graded and feedback sent to student!', 'success');
        setSubmissions((prev) =>
          prev.map((s) => (s._id === gradingSubmission._id ? res.data.submission : s))
        );
        setGradingSubmission(null);
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error grading submission', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Assignment Evaluation & Grading
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review student project submissions, evaluate code assets, and award verified grades.
        </p>
      </div>

      {/* Course & Assignment Selector Row */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Select Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Select Assignment
          </label>
          <select
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            disabled={assignments.length === 0}
            className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            {assignments.length === 0 ? (
              <option>No assignments for this course</option>
            ) : (
              assignments.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.title} ({a.totalMarks} marks)
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Student Submissions ({submissions.length})
        </h3>

        {submissions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            No submissions turned in for this assignment yet.
          </div>
        ) : (
          submissions.map((sub) => (
            <div
              key={sub._id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      sub.student?.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        sub.student?.name || 'Student'
                      )}`
                    }
                    alt={sub.student?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sub.student?.name}
                    </h4>
                    <p className="text-xs text-slate-400">{sub.student?.email}</p>
                  </div>
                </div>

                {sub.studentNotes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    "{sub.studentNotes}"
                  </p>
                )}

                {/* Submitted Files */}
                {sub.submissionFiles?.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {sub.submissionFiles.map((f, i) => (
                      <a
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{f.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Status & Grade action */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <Badge variant={sub.status === 'graded' ? 'success' : 'primary'} size="xs">
                    {sub.status === 'graded' ? (() => {
                      const m = sub.marksAwarded || 0;
                      let l = 'F'; let gp = 0.0;
                      if (m >= 95) { l = 'A+'; gp = 4.0; }
                      else if (m >= 90) { l = 'A'; gp = 4.0; }
                      else if (m >= 85) { l = 'A-'; gp = 3.7; }
                      else if (m >= 80) { l = 'B+'; gp = 3.3; }
                      else if (m >= 75) { l = 'B'; gp = 3.0; }
                      else if (m >= 70) { l = 'B-'; gp = 2.7; }
                      else if (m >= 60) { l = 'C'; gp = 2.0; }
                      return `${sub.marksAwarded}/100 • Grade ${l} (${gp.toFixed(1)} GP)`;
                    })() : 'Pending Grade'}
                  </Badge>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setGradingSubmission(sub);
                    setMarksAwarded(sub.marksAwarded || 100);
                    setFeedback(sub.feedback || '');
                    setStatus(sub.status || 'graded');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  {sub.status === 'graded' ? 'Edit Grade' : 'Grade Submission'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Grading Modal */}
      {gradingSubmission && (
        <Modal
          isOpen={!!gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          title={`Grade: ${gradingSubmission.student?.name}`}
        >
          <form onSubmit={handleGrade} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Marks Awarded (out of 100)
                </label>
                {(() => {
                  const m = Number(marksAwarded) || 0;
                  let grade = 'F';
                  let gp = 0.0;
                  if (m >= 95) { grade = 'A+'; gp = 4.0; }
                  else if (m >= 90) { grade = 'A'; gp = 4.0; }
                  else if (m >= 85) { grade = 'A-'; gp = 3.7; }
                  else if (m >= 80) { grade = 'B+'; gp = 3.3; }
                  else if (m >= 75) { grade = 'B'; gp = 3.0; }
                  else if (m >= 70) { grade = 'B-'; gp = 2.7; }
                  else if (m >= 60) { grade = 'C'; gp = 2.0; }
                  return (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Grade {grade} • {gp.toFixed(1)} GP
                    </span>
                  );
                })()}
              </div>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={marksAwarded}
                onChange={(e) => setMarksAwarded(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="graded">Graded (Satisfactory)</option>
                <option value="resubmission-required">Resubmission Required</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Constructive Instructor Feedback
              </label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Well implemented architecture. Next time optimize the query filters..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Finalize Grade & Notify Student'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
