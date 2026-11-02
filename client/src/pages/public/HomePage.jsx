import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Star,
  Shield,
  Code,
  Brain,
  Cloud,
  ChevronDown,
  Play,
} from 'lucide-react';
import api from '../../services/api';
import { CourseCard } from '../../components/course/CourseCard';
import { CourseCardSkeleton } from '../../components/common/Skeleton';

export const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          api.get('/courses?limit=3&sort=popular'),
          api.get('/courses/categories'),
        ]);
        if (courseRes.data?.success) setFeaturedCourses(courseRes.data.courses);
        if (catRes.data?.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const faqs = [
    {
      q: 'How do verified certificates work on EduSphere?',
      a: 'Once you complete 100% of all curriculum milestones and pass the course assessment, EduSphere automatically generates a digitally signed PDF certificate stamped with a tamper-proof verification ID that employers can verify in real-time.',
    },
    {
      q: 'Can I access course materials on mobile devices?',
      a: 'Yes! EduSphere is built with an adaptive responsive architecture. You can watch high-definition video lessons, review code articles, and take quizzes on any phone, tablet, or desktop.',
    },
    {
      q: 'What payment methods are supported for paid courses?',
      a: 'We support seamless Indian payments via Razorpay, including UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ banks, Credit/Debit cards, and digital wallets.',
    },
    {
      q: 'Can I become an instructor on EduSphere?',
      a: 'Absolutely. You can sign up with an Instructor account to access our complete Course Studio, upload multi-section video lessons, create timed assessments, and grade student assignments.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(15,23,42,0))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation EdTech Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Learn New Skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500">
              Build Your Future.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Master full-stack software engineering, artificial intelligence, cloud infrastructure, and modern design through production-grade interactive curricula and verifiable credentials.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center shadow-sm"
            >
              Get Started for Free
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">10,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Active Students</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">98.4%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">4.9 / 5.0</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Instructor Rating</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Verifiable Credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Curated Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Learning Paths
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View all courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        )}
      </section>

      {/* Browse Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Top Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Explore High-Demand Tech Disciplines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/courses?category=${cat.slug}`}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <span className="inline-block mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {cat.courseCount || 0} Courses →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose EduSphere */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl mx-4 sm:mx-8 lg:mx-auto max-w-7xl px-6 sm:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Engineered For Real Growth
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
            Why Top Developers Choose EduSphere
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            We reject shallow video tutorials in favor of deep mastery, hands-on architectural code, and continuous assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Interactive Learning Player</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resume anywhere automatically, customize playback speeds up to 2x, download reference materials, and track lesson completion server-side.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Verifiable PDF Credentials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every course completion produces a cryptographic certificate ID backed by public URL verification that recruiters can validate immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Real Assessment & Feedback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timed quizzes with server-evaluated score breakdowns and capstone assignments evaluated personally by expert instructors.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transform transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
