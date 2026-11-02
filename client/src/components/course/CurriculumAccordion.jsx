import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  Lock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const CurriculumAccordion = ({
  curriculum = [],
  completedLessonIds = [],
  activeLessonId,
  onSelectLesson,
  isEnrolled = false,
}) => {
  const [openSections, setOpenSections] = useState(() => {
    // Open first 2 sections by default
    const init = {};
    curriculum.forEach((_, idx) => {
      init[idx] = idx < 2;
    });
    return init;
  });

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-3">
      {curriculum.map((section, idx) => {
        const isOpen = !!openSections[idx];
        const lessons = section.lessons || [];

        return (
          <div
            key={section._id || idx}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors shadow-sm"
          >
            {/* Section Header */}
            <button
              onClick={() => toggleSection(idx)}
              className="w-full flex items-center justify-between p-4 text-left bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                  Section {idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {/* Lessons List */}
            {isOpen && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {lessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson._id);
                  const isActive = activeLessonId === lesson._id;
                  const canAccess = isEnrolled || lesson.isPreviewAllowed;

                  return (
                    <div
                      key={lesson._id}
                      onClick={() => canAccess && onSelectLesson && onSelectLesson(lesson)}
                      className={`flex items-center justify-between p-3.5 text-xs transition-colors ${
                        canAccess
                          ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          : 'opacity-70 cursor-not-allowed bg-slate-50/20 dark:bg-slate-900/30'
                      } ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/40 font-bold' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : lesson.type === 'video' ? (
                          <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        )}

                        <span
                          className={`${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {lesson.videoDurationSeconds > 0 && (
                          <span className="text-slate-400">
                            {Math.round(lesson.videoDurationSeconds / 60)} min
                          </span>
                        )}

                        {lesson.isPreviewAllowed && !isEnrolled && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Preview
                          </span>
                        )}

                        {!canAccess && (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
