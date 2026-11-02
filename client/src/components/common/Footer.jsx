import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useNotifications();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast('Please enter a valid email address.', 'warning');
      return;
    }
    toast('Thank you for subscribing to EduSphere Dispatch!', 'success');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Edu<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering global learners through accredited courses, hands-on coding environments, expert instructors, and verified digital credentials.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Grade Security & Cryptographic Verification</span>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/courses?category=web-development" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-science-ai" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Data Science & AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=cloud-devops" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About EduSphere
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/verify/EDU-2026-SAMPLE" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Teach on EduSphere
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Receive newly published courses, system architecture breakdowns, and career guides.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@work.com"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EduSphere Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-indigo-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-600 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
