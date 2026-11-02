import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Download,
  Award,
  HelpCircle,
  FolderOpen,
  ArrowLeft,
  PlayCircle,
  Menu,
  X,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { VideoPlayer } from '../../components/course/VideoPlayer';
import { CurriculumAccordion } from '../../components/course/CurriculumAccordion';
import { Skeleton } from '../../components/common/Skeleton';
import { Badge } from '../../components/common/Badge';

export const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useNotifications();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('lesson'); // 'lesson' | 'quizzes' | 'assignments'

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const [currRes, progRes, quizRes, assignRes] = await Promise.all([
          api.get(`/courses/${courseId}/curriculum`),
          api.get(`/progress/courses/${courseId}`),
          api.get(`/quizzes/courses/${courseId}`),
          api.get(`/assignments/courses/${courseId}`),
        ]);

        if (currRes.data?.success) {
          setCourse(currRes.data.course);
          setCurriculum(currRes.data.curriculum || []);

          // Find first uncompleted lesson or first lesson
          const allLessons = [];
          currRes.data.curriculum.forEach((sec) => {
            (sec.lessons || []).forEach((l) => allLessons.push(l));
          });

          const completed = progRes.data?.progress?.completedLessons || [];
          const nextLesson =
            allLessons.find((l) => !completed.includes(l._id)) || allLessons[0];
          setActiveLesson(nextLesson || null);
        }

        if (progRes.data?.success) {
          setProgress(progRes.data.progress);
        }

        if (quizRes.data?.success) setQuizzes(quizRes.data.quizzes || []);
        if (assignRes.data?.success) setAssignments(assignRes.data.assignments || []);
      } catch (err) {
        toast(err.response?.data?.message || 'Failed to load course materials', 'error');
        navigate('/student/my-courses');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId, navigate, toast]);

  // Update progress
  const handleProgressUpdate = async (seconds) => {
    if (!activeLesson) return;
    try {
      await api.patch(`/progress/courses/${courseId}/lessons/${activeLesson._id}`, {
        lastPositionSeconds: seconds,
        markCompleted: false,
      });
    } catch (err) {
      // ignore
    }
  };

  // Mark lesson as complete
  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    try {
      const res = await api.patch(
        `/progress/courses/${courseId}/lessons/${activeLesson._id}`,
        { markCompleted: true }
      );

      if (res.data?.success) {
        setProgress(res.data.progress);
        toast('Lesson completed!', 'success');

        if (res.data.progress.percentCompleted === 100) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        // Advance to next lesson
        handleNextLesson();
      }
    } catch (err) {
      toast('Failed to record completion', 'error');
    }
  };

  // Navigation between lessons
  const getAllLessonsFlat = () => {
    const list = [];
    curriculum.forEach((sec) => {
      (sec.lessons || []).forEach((l) => list.push(l));
    });
    return list;
  };

  const handleNextLesson = () => {
    const all = getAllLessonsFlat();
    const currIdx = all.findIndex((l) => l._id === activeLesson?._id);
    if (currIdx > -1 && currIdx < all.length - 1) {
      setActiveLesson(all[currIdx + 1]);
    }
  };

  const handlePrevLesson = () => {
    const all = getAllLessonsFlat();
    const currIdx = all.findIndex((l) => l._id === activeLesson?._id);
    if (currIdx > 0) {
      setActiveLesson(all[currIdx - 1]);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="aspect-video w-full rounded-3xl" />
      </div>
    );
  }

  const allLessons = getAllLessonsFlat();
  const currentIndex = allLessons.findIndex((l) => l._id === activeLesson?._id);
  const completedIds = progress?.completedLessons || [];
  const isCurrentCompleted = completedIds.includes(activeLesson?._id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Top Learning Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/student/my-courses"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              EduSphere Course Studio
            </span>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              {course?.title}
            </h1>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {progress?.percentCompleted || 0}% Complete
            </span>
            <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${progress?.percentCompleted || 0}%` }}
              />
            </div>
          </div>

          {progress?.percentCompleted === 100 && (
            <Link
              to="/student/certificates"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Claim Certificate</span>
            </Link>
          )}

          {/* Mobile Curriculum Drawer button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Two-Column Learning Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column (Video / Article / Quizzes / Assignments Stage) */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('lesson')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'lesson'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Current Lesson</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'quizzes'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Quizzes ({quizzes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'assignments'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Assignments ({assignments.length})</span>
            </button>
          </div>

          {/* TAB 1: Current Lesson */}
          {activeTab === 'lesson' && activeLesson && (
            <div className="space-y-6">
              {/* Stage: Video or Article */}
              {activeLesson.type === 'video' ? (
                <VideoPlayer
                  key={activeLesson._id}
                  videoUrl={activeLesson.videoUrl}
                  initialPosition={0}
                  onProgressUpdate={handleProgressUpdate}
                  onComplete={handleCompleteLesson}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Technical Article / Reading Material
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
                  <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeLesson.contentBody || activeLesson.description}
                  </div>
                </div>
              )}

              {/* Lesson Info & Completion Actions */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activeLesson.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeLesson.description || 'Watch the lesson video and practice the code exercise.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCompleteLesson}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isCurrentCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCurrentCompleted ? 'Completed' : 'Mark as Completed'}</span>
                  </button>
                </div>
              </div>

              {/* Downloadable Resources */}
              {activeLesson.resources?.length > 0 && (
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Downloadable Resources & Code Assets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          <Download className="w-4 h-4" />
                          <span>{res.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{res.fileSize || '1 MB'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentIndex <= 0}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Lesson</span>
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={currentIndex >= allLessons.length - 1}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Course Quizzes */}
          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Course Quizzes & Assessments
              </h3>
              {quizzes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No quizzes published for this course yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((q) => (
                    <div
                      key={q._id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {q.title}
                        </h4>
                        <p className="text-xs text-slate-500">{q.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                          <span>⏱️ {q.durationMinutes} mins</span>
                          <span>🎯 Pass: {q.passingPercentage}%</span>
                          <span>💯 {q.totalMarks} marks</span>
                        </div>
                      </div>

                      <Link
                        to={`/student/quiz/${q._id}`}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2"
                      >
                        <span>Start Assessment</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Capstone Assignments */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Course Assignments
              </h3>
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No assignments published for this course yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((a) => (
                    <div
                      key={a._id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {a.title}
                        </h4>
                        <span className="text-xs font-bold text-indigo-600">
                          {a.totalMarks} Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {a.instructions}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400">
                          Status: {a.submission?.status || 'Not Submitted'}
                        </span>
                        <Link
                          to="/student/assignments"
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Go to Assignment Portal
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column / Curriculum Sidebar (Desktop & Mobile Drawer) */}
        <div
          className={`lg:block w-full lg:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 overflow-y-auto ${
            sidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Course Content
            </h3>
            <p className="text-[11px] text-slate-400">
              {allLessons.length} lessons • {completedIds.length} completed
            </p>
          </div>

          <CurriculumAccordion
            curriculum={curriculum}
            completedLessonIds={completedIds}
            activeLessonId={activeLesson?._id}
            isEnrolled={true}
            onSelectLesson={(lesson) => {
              setActiveLesson(lesson);
              setActiveTab('lesson');
              setSidebarOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};
