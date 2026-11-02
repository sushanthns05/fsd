import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export const QuizResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const result = location.state?.result;
  const quizTitle = location.state?.quizTitle || 'Assessment Results';

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h3 className="text-lg font-bold">No recent attempt found.</h3>
        <Link to="/student" className="text-indigo-600 text-xs font-bold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { percentage, scoreAchieved, totalMarks, isPassed, passingPercentage, remainingAttempts } =
    result;

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
            isPassed
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
          }`}
        >
          {isPassed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isPassed ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPassed ? 'Assessment Passed 🎉' : 'Assessment Not Passed'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {quizTitle}
          </h2>
        </div>

        {/* Big percentage circle/pill */}
        <div className="py-4">
          <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {percentage}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            You scored {scoreAchieved} out of {totalMarks} marks
          </p>
        </div>

        {/* Details list */}
        <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-400">Required Passing Score</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{passingPercentage}%</p>
          </div>
          <div>
            <span className="text-slate-400">Remaining Attempts</span>
            <p className="font-bold text-slate-900 dark:text-white mt-0.5">{remainingAttempts}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {!isPassed && remainingAttempts !== 0 && (
            <Link
              to={`/student/quiz/${id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </Link>
          )}

          <Link
            to="/student/my-courses"
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
