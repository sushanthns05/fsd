import React from 'react';
import { Target, Compass, Award, Shield, Users, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision & Mission</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Transforming Technical Education Through Applied Engineering
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          EduSphere was conceived with a singular goal: eliminate the massive disconnect between theoretical tutorials and real-world commercial software engineering.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Provide accessible, rigorous, and verified technical curricula crafted directly by seasoned practitioners who build production software daily.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            A world where any ambitious learner can master modern full-stack development, AI, and DevOps without paying extortionate university tuition fees.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Verifiable Standards</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Credentials on EduSphere require 100% curriculum completion and rigorous server-side assessments, establishing real credibility with employers.
          </p>
        </div>
      </div>

      {/* Leadership / Faculty */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Meet the Academic Faculty
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Industry leaders committed to student success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
              alt="Dr. Aris Thorne"
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500"
            />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Dr. Aris Thorne</h4>
            <p className="text-xs text-indigo-600 font-semibold">Principal Software Architect</p>
            <p className="text-xs text-slate-500">Ex-FAANG Lead specializing in resilient distributed web systems and micro-modular React architectures.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80"
              alt="Sophia Chen"
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500"
            />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Sophia Chen</h4>
            <p className="text-xs text-indigo-600 font-semibold">AI Research Lead</p>
            <p className="text-xs text-slate-500">Specializes in neural network optimization, PyTorch deep learning, and cloud machine learning pipelines.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
              alt="Eleanor Vance"
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-indigo-500"
            />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Eleanor Vance</h4>
            <p className="text-xs text-indigo-600 font-semibold">Academic Dean & Compliance</p>
            <p className="text-xs text-slate-500">Governs curriculum verification standards, student ethics, and institutional accreditation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
