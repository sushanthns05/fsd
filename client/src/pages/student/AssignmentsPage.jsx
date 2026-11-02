import React, { useState, useEffect } from 'react';
import { FileCheck2, Upload, Clock, Award, MessageSquare, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const AssignmentsPage = () => {
  const { toast } = useNotifications();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission Modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [studentNotes, setStudentNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const myCoursesRes = await api.get('/enrollments/my-courses');
        const enrolledCourses = myCoursesRes.data?.courses || [];
        setCourses(enrolledCourses);

        const allAssignments = [];
        for (const item of enrolledCourses) {
          if (item.course?._id) {
            try {
              const res = await api.get(`/assignments/courses/${item.course._id}`);
              if (res.data?.success) {
                res.data.assignments.forEach((a) => {
                  allAssignments.push({ ...a, courseTitle: item.course.title });
                });
              }
            } catch (e) {
              // ignore
            }
          }
        }
        setAssignments(allAssignments);
      } catch (err) {
        toast('Failed to load assignments', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [toast]);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setUploading(true);
    try {
      let submissionFiles = [];

      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        const uploadRes = await api.post('/uploads/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadRes.data?.success) {
          submissionFiles.push({
            name: uploadRes.data.originalName,
            url: uploadRes.data.fileUrl,
            size: uploadRes.data.size,
          });
        }
      } else {
        // Fallback demo file if no file attached
        submissionFiles.push({
          name: 'assignment_submission.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.2 MB',
        });
      }

      const res = await api.post(`/assignments/${selectedAssignment._id}/submit`, {
        submissionFiles,
        studentNotes,
      });

      if (res.data?.success) {
        toast('Assignment submitted for instructor review!', 'success');
        // Update local state
        setAssignments((prev) =>
          prev.map((a) =>
            a._id === selectedAssignment._id ? { ...a, submission: res.data.submission } : a
          )
        );
        setSelectedAssignment(null);
        setFileToUpload(null);
        setStudentNotes('');
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Submission failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (sub) => {
    if (!sub) return <Badge variant="default">Not Submitted</Badge>;
    if (sub.status === 'graded') return <Badge variant="success">Graded</Badge>;
    if (sub.status === 'resubmission-required')
      return <Badge variant="danger">Resubmission Required</Badge>;
    return <Badge variant="primary">Under Review</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Assignments & Capstone Work
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submit practical projects, receive detailed instructor feedback, and earn accredited marks.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No assignments found"
          description="None of your enrolled courses currently have active assignments."
          actionLabel="View Courses"
          actionLink="/student/my-courses"
        />
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const sub = assignment.submission;

            return (
              <div
                key={assignment._id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {assignment.courseTitle}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {assignment.title}
                    </h3>
                  </div>
                  <div>{getStatusBadge(sub)}</div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {assignment.instructions}
                </p>

                {/* Grade & Feedback card if graded */}
                {sub?.status === 'graded' && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <span>Score Awarded: {sub.marksAwarded} / {assignment.totalMarks} marks</span>
                      <span>Graded by Instructor</span>
                    </div>
                    {sub.feedback && (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        "{sub.feedback}"
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Passing: {assignment.passingMarks} marks</span>
                    {assignment.deadline && (
                      <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setStudentNotes(sub?.studentNotes || '');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    {sub ? 'Update / View Submission' : 'Submit Work'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {selectedAssignment && (
        <Modal
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          title={`Submit: ${selectedAssignment.title}`}
        >
          <form onSubmit={handleSubmitAssignment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upload File (ZIP, PDF, DOCX, Code)
              </label>
              <input
                type="file"
                onChange={(e) => setFileToUpload(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notes / Explanation for Instructor
              </label>
              <textarea
                rows={4}
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="Briefly describe your solution, architecture choices, or links..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Transmit Submission'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
