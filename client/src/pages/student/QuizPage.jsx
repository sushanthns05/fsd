import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { Skeleton } from '../../components/common/Skeleton';

export const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useNotifications();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: [index] }
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        if (res.data?.success) {
          setQuiz(res.data.quiz);
          setQuestions(res.data.questions || []);
          setTimeLeft((res.data.quiz?.durationMinutes || 15) * 60);

          if (!res.data.canAttempt) {
            toast('Maximum attempts already exhausted for this quiz.', 'warning');
          }
        }
      } catch (err) {
        toast(err.response?.data?.message || 'Failed to load quiz', 'error');
        navigate('/student');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate, toast]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(); // auto-submit on time expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const handleSelectOption = (qId, optionIdx, isMultiple) => {
    setSelectedAnswers((prev) => {
      const current = prev[qId] || [];
      if (isMultiple) {
        if (current.includes(optionIdx)) {
          return { ...prev, [qId]: current.filter((i) => i !== optionIdx) };
        } else {
          return { ...prev, [qId]: [...current, optionIdx] };
        }
      } else {
        return { ...prev, [qId]: [optionIdx] };
      }
    });
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(selectedAnswers).map(([qId, options]) => ({
        questionId: qId,
        selectedOptions: options,
      }));

      const res = await api.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers,
        timeSpentSeconds: ((quiz?.durationMinutes || 15) * 60) - timeLeft,
      });

      if (res.data?.success) {
        toast('Quiz submitted and scored successfully!', 'success');
        navigate(`/student/quiz/${id}/results`, {
          state: { result: res.data.result, quizTitle: quiz?.title },
        });
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Quiz submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const totalQ = questions.length;
  const currentSelections = currentQ ? selectedAnswers[currentQ._id] || [] : [];

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Quiz Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Assessment Engine
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {quiz?.title}
          </h1>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm font-bold">
          <Clock className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Question Stepper */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {questions.map((q, idx) => {
          const isAnswered = (selectedAnswers[q._id] || []).length > 0;
          const isCurrent = currentQIndex === idx;

          return (
            <button
              key={q._id}
              onClick={() => setCurrentQIndex(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isCurrent
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400'
                  : isAnswered
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span>
              Question {currentQIndex + 1} of {totalQ}
            </span>
            <span>{currentQ.marks || 10} marks</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h3>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options?.map((opt) => {
              const isSelected = currentSelections.includes(opt.index);

              return (
                <div
                  key={opt.index}
                  onClick={() =>
                    handleSelectOption(
                      currentQ._id,
                      opt.index,
                      currentQ.questionType === 'multiple-choice'
                    )
                  }
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.text}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation & Submit buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentQIndex < totalQ - 1 ? (
              <button
                onClick={() => setCurrentQIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-md shadow-emerald-500/25 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Evaluating...' : 'Submit & Score Quiz'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
