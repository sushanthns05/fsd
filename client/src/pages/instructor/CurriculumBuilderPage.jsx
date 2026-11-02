import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PlusCircle,
  PlayCircle,
  FileText,
  Trash2,
  Send,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const CurriculumBuilderPage = () => {
  const { id } = useParams();
  const { toast } = useNotifications();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    type: 'video',
    videoUrl: '',
    videoDurationSeconds: 600,
    contentBody: '',
    isPreviewAllowed: false,
  });

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    durationMinutes: 15,
    passingPercentage: 70,
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [questionData, setQuestionData] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    explanation: '',
    marks: 10,
  });

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    instructions: '',
    totalMarks: 100,
    passingMarks: 50,
  });

  const loadData = async () => {
    try {
      const [currRes, quizRes, assignRes] = await Promise.all([
        api.get(`/courses/${id}/curriculum`),
        api.get(`/quizzes/courses/${id}`),
        api.get(`/assignments/courses/${id}`),
      ]);
      if (currRes.data?.success) {
        setCourse(currRes.data.course);
        setCurriculum(currRes.data.curriculum || []);
      }
      if (quizRes.data?.success) setQuizzes(quizRes.data.quizzes || []);
      if (assignRes.data?.success) setAssignments(assignRes.data.assignments || []);
    } catch (err) {
      toast('Failed to load curriculum', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Handle Add Section
  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/courses/${id}/sections`, { title: sectionTitle });
      if (res.data?.success) {
        toast('Section created!', 'success');
        setShowSectionModal(false);
        setSectionTitle('');
        loadData();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error creating section', 'error');
    }
  };

  // Handle Add Lesson
  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/courses/sections/${activeSectionId}/lessons`, lessonData);
      if (res.data?.success) {
        toast('Lesson added successfully!', 'success');
        setShowLessonModal(false);
        setLessonData({
          title: '',
          type: 'video',
          videoUrl: '',
          videoDurationSeconds: 600,
          contentBody: '',
          isPreviewAllowed: false,
        });
        loadData();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error creating lesson', 'error');
    }
  };

  // Handle Add Quiz
  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/quizzes/courses/${id}`, quizData);
      if (res.data?.success) {
        toast('Quiz initialized!', 'success');
        setShowQuizModal(false);
        setQuizData({ title: '', durationMinutes: 15, passingPercentage: 70 });
        loadData();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error creating quiz', 'error');
    }
  };

  // Handle Add Question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/quizzes/${activeQuizId}/questions`, questionData);
      if (res.data?.success) {
        toast('Question added to quiz!', 'success');
        setShowQuestionModal(false);
        setQuestionData({
          questionText: '',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
          explanation: '',
          marks: 10,
        });
        loadData();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error adding question', 'error');
    }
  };

  // Handle Add Assignment
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/assignments/courses/${id}`, assignmentData);
      if (res.data?.success) {
        toast('Assignment created!', 'success');
        setShowAssignmentModal(false);
        setAssignmentData({ title: '', instructions: '', totalMarks: 100, passingMarks: 50 });
        loadData();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Error creating assignment', 'error');
    }
  };

  // Handle Submit for Review
  const handleSubmitCourse = async () => {
    try {
      const res = await api.post(`/courses/${id}/submit`);
      if (res.data?.success) {
        toast('Course submitted for administrator review!', 'success');
        loadData();
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to submit course for review', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/instructor/courses"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Curriculum Builder
              </span>
              <Badge variant={course?.status === 'published' ? 'success' : 'default'} size="xs">
                {course?.status}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
              {course?.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSectionModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Section</span>
          </button>

          {course?.status === 'draft' && (
            <button
              onClick={handleSubmitCourse}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Review</span>
            </button>
          )}
        </div>
      </div>

      {/* Sections and Lessons List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Curriculum Sections ({curriculum.length})
          </h2>
        </div>

        {curriculum.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No sections created yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start by creating your first course section (e.g., "Module 1: Foundations").
            </p>
            <button
              onClick={() => setShowSectionModal(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              Create First Section
            </button>
          </div>
        ) : (
          curriculum.map((section, idx) => (
            <div
              key={section._id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                    Section {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setActiveSectionId(section._id);
                    setShowLessonModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Lesson</span>
                </button>
              </div>

              {/* Lessons */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {(section.lessons || []).length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No lessons in this section. Click "+ Add Lesson" above.
                  </div>
                ) : (
                  section.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.type === 'video' ? (
                          <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {lesson.title}
                          </span>
                          <span className="text-slate-400 ml-2">
                            ({lesson.type} • {Math.round((lesson.videoDurationSeconds || 0) / 60)} mins)
                          </span>
                        </div>
                      </div>

                      {lesson.isPreviewAllowed && (
                        <Badge variant="primary" size="xs">
                          Free Preview
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quizzes & Assessments */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Course Quizzes ({quizzes.length})
            </h3>
          </div>
          <button
            onClick={() => setShowQuizModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Quiz</span>
          </button>
        </div>

        <div className="space-y-3">
          {quizzes.map((q) => (
            <div
              key={q._id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.title}</h4>
                <p className="text-xs text-slate-500">
                  {q.durationMinutes} mins • {q.passingPercentage}% pass • {q.questionsCount || 0} questions
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveQuizId(q._id);
                  setShowQuestionModal(true);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50"
              >
                + Add Question
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Capstone Assignments */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Capstone Assignments ({assignments.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAssignmentModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Assignment</span>
          </button>
        </div>

        <div className="space-y-3">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</h4>
                <p className="text-xs text-slate-500">{a.totalMarks} marks • Passing: {a.passingMarks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Section Modal */}
      <Modal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        title="Create New Section"
      >
        <form onSubmit={handleAddSection} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Section Title *</label>
            <input
              type="text"
              required
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g. Module 2: Express Controllers & Routing"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Section
          </button>
        </form>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title="Add Lesson to Section"
      >
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Lesson Title *</label>
            <input
              type="text"
              required
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              placeholder="e.g. Writing JWT Middleware"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Type</label>
              <select
                value={lessonData.type}
                onChange={(e) => setLessonData({ ...lessonData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="video">Video Lesson</option>
                <option value="article">Article / Code Guide</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Duration (Seconds)</label>
              <input
                type="number"
                value={lessonData.videoDurationSeconds}
                onChange={(e) =>
                  setLessonData({
                    ...lessonData,
                    videoDurationSeconds: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {lessonData.type === 'video' ? (
            <div>
              <label className="block text-xs font-semibold mb-1">Video Stream URL (MP4)</label>
              <input
                type="url"
                required
                value={lessonData.videoUrl}
                onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold mb-1">Article Body Content</label>
              <textarea
                rows={4}
                value={lessonData.contentBody}
                onChange={(e) => setLessonData({ ...lessonData, contentBody: e.target.value })}
                placeholder="Markdown or text explanation..."
                className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lessonData.isPreviewAllowed}
              onChange={(e) =>
                setLessonData({ ...lessonData, isPreviewAllowed: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span className="text-xs font-semibold">Allow Public Free Preview</span>
          </label>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Lesson
          </button>
        </form>
      </Modal>

      {/* Add Quiz Modal */}
      <Modal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        title="Create Course Quiz"
      >
        <form onSubmit={handleAddQuiz} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Quiz Title *</label>
            <input
              type="text"
              required
              value={quizData.title}
              onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
              placeholder="e.g. Intermediate REST Architecture Quiz"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Duration (Mins)</label>
              <input
                type="number"
                value={quizData.durationMinutes}
                onChange={(e) =>
                  setQuizData({ ...quizData, durationMinutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Pass %</label>
              <input
                type="number"
                value={quizData.passingPercentage}
                onChange={(e) =>
                  setQuizData({ ...quizData, passingPercentage: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Initialize Quiz
          </button>
        </form>
      </Modal>

      {/* Add Question Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title="Add Question to Quiz"
      >
        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Question Prompt *</label>
            <textarea
              rows={2}
              required
              value={questionData.questionText}
              onChange={(e) =>
                setQuestionData({ ...questionData, questionText: e.target.value })
              }
              placeholder="e.g. Which HTTP method is idempotent?"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold">Options (Select Correct)</label>
            {questionData.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={(e) => {
                    const updated = [...questionData.options];
                    updated[idx].isCorrect = e.target.checked;
                    setQuestionData({ ...questionData, options: updated });
                  }}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <input
                  type="text"
                  required
                  value={opt.text}
                  onChange={(e) => {
                    const updated = [...questionData.options];
                    updated[idx].text = e.target.value;
                    setQuestionData({ ...questionData, options: updated });
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Question
          </button>
        </form>
      </Modal>

      {/* Add Assignment Modal */}
      <Modal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        title="Create Capstone Assignment"
      >
        <form onSubmit={handleAddAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              value={assignmentData.title}
              onChange={(e) =>
                setAssignmentData({ ...assignmentData, title: e.target.value })
              }
              placeholder="e.g. Build an Authenticated Microservice API"
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Instructions *</label>
            <textarea
              rows={4}
              required
              value={assignmentData.instructions}
              onChange={(e) =>
                setAssignmentData({ ...assignmentData, instructions: e.target.value })
              }
              placeholder="Specify requirements, deliverables, and grading rubric..."
              className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Total Marks</label>
              <input
                type="number"
                value={assignmentData.totalMarks}
                onChange={(e) =>
                  setAssignmentData({ ...assignmentData, totalMarks: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Passing Marks</label>
              <input
                type="number"
                value={assignmentData.passingMarks}
                onChange={(e) =>
                  setAssignmentData({ ...assignmentData, passingMarks: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Assignment
          </button>
        </form>
      </Modal>
    </div>
  );
};
