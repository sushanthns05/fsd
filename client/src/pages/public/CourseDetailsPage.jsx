import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  Users,
  Award,
  CheckCircle2,
  Play,
  ShieldCheck,
  Star,
  FileText,
  Lock,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { RatingStars } from '../../components/course/RatingStars';
import { CurriculumAccordion } from '../../components/course/CurriculumAccordion';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';

export const CourseDetailsPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Preview Modal
  const [previewLesson, setPreviewLesson] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/${slug}`);
        if (res.data?.success) {
          setCourse(res.data.course);
          setCurriculum(res.data.curriculum || []);
          setReviews(res.data.reviews || []);
          setIsEnrolled(res.data.isEnrolled || false);
        }
      } catch (err) {
        toast(err.response?.data?.message || 'Course not found', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  // Handle Free Enrollment
  const handleFreeEnroll = async () => {
    if (!isAuthenticated) {
      toast('Please log in to enroll in this course.', 'warning');
      return navigate('/login');
    }

    setActionLoading(true);
    try {
      const res = await api.post('/enrollments/free', { courseId: course._id });
      if (res.data?.success) {
        toast('Enrolled successfully! Welcome to the course.', 'success');
        setIsEnrolled(true);
        navigate(`/learn/${course._id}`);
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Enrollment failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Paid Razorpay Checkout
  const handlePaidCheckout = async () => {
    if (!isAuthenticated) {
      toast('Please log in to purchase this course.', 'warning');
      return navigate('/login');
    }

    setActionLoading(true);
    try {
      const res = await api.post('/payments/create-order', { courseId: course._id });
      if (!res.data?.success) {
        throw new Error(res.data?.message || 'Failed to create payment order');
      }

      const { orderId, amount, currency } = res.data;

      // In development / demo environment without live gateway UI popup,
      // simulate verified checkout verification
      const verifyRes = await api.post('/payments/verify', {
        courseId: course._id,
        orderId,
        paymentId: `pay_mock_${Date.now()}`,
        signature: 'mock_sig_seed_verified',
      });

      if (verifyRes.data?.success) {
        toast('Payment confirmed! Enrollment complete.', 'success');
        setIsEnrolled(true);
        navigate(`/learn/${course._id}`);
      }
    } catch (err) {
      toast(err.response?.data?.message || 'Payment processing error', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold">Course not found.</h2>
        <Link to="/courses" className="text-indigo-600 mt-2 inline-block">
          Return to course catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <section className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="xs">
                  {course.difficulty}
                </Badge>
                {course.category?.name && (
                  <span className="text-xs font-semibold text-slate-400">
                    {course.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {course.subtitle || course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
                <RatingStars rating={course.ratingAverage} count={course.ratingCount} />
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{course.enrolledCount} learners enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{course.totalDurationMinutes} mins total duration</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img
                  src={
                    course.instructor?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      course.instructor?.name || 'Instructor'
                    )}`
                  }
                  alt={course.instructor?.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <p className="text-xs text-slate-400">Taught by</p>
                  <p className="text-sm font-bold text-white">{course.instructor?.name}</p>
                </div>
              </div>
            </div>

            {/* Desktop Preview Card (Sidebar on top right) */}
            <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-slate-950">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90"
                />
                {course.trailerVideoUrl && (
                  <button
                    onClick={() =>
                      setPreviewLesson({
                        title: `${course.title} - Preview Trailer`,
                        videoUrl: course.trailerVideoUrl,
                      })
                    }
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 ml-0.5" />
                  </button>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  {course.isFree || course.price === 0 ? (
                    <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                      FREE
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      {course.discountPrice > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{course.discountPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full lifetime access including verified certificate
                </p>
              </div>

              {isEnrolled ? (
                <Link
                  to={`/learn/${course._id}`}
                  className="w-full py-3.5 rounded-xl font-bold text-center text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Continue Learning</span>
                </Link>
              ) : course.isFree || course.price === 0 ? (
                <button
                  onClick={handleFreeEnroll}
                  disabled={actionLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{actionLoading ? 'Enrolling...' : 'Enroll Now — Free'}</span>
                </button>
              ) : (
                <button
                  onClick={handlePaidCheckout}
                  disabled={actionLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{actionLoading ? 'Processing Checkout...' : 'Enroll with Razorpay'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-10">
            {/* Learning Objectives */}
            {course.objectives?.length > 0 && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  What you'll learn in this course
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Course Content
                </h3>
                <span className="text-xs text-slate-500">
                  {curriculum.length} sections • {course.totalLessons} lessons
                </span>
              </div>
              <CurriculumAccordion
                curriculum={curriculum}
                isEnrolled={isEnrolled}
                onSelectLesson={(lesson) => {
                  if (isEnrolled) {
                    navigate(`/learn/${course._id}`);
                  } else if (lesson.isPreviewAllowed && lesson.videoUrl) {
                    setPreviewLesson(lesson);
                  }
                }}
              />
            </div>

            {/* Requirements & Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Course Description
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                {course.description}
              </div>
            </div>

            {/* Student Reviews */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Learner Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-500">No reviews submitted yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              rev.student?.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                rev.student?.name || 'Learner'
                              )}`
                            }
                            alt={rev.student?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rev.student?.name}
                          </span>
                        </div>
                        <RatingStars rating={rev.rating} showCount={false} />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column / Mobile buy button & Instructor Profile */}
          <div className="space-y-6">
            <div className="lg:hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="text-2xl font-extrabold mb-4">
                {course.isFree || course.price === 0 ? 'FREE' : `₹${course.price}`}
              </div>
              {isEnrolled ? (
                <Link
                  to={`/learn/${course._id}`}
                  className="w-full py-3 rounded-xl font-bold text-center text-white bg-emerald-600 hover:bg-emerald-700 block"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={course.isFree ? handleFreeEnroll : handlePaidCheckout}
                  className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 block"
                >
                  {course.isFree ? 'Enroll Free' : 'Purchase Course'}
                </button>
              )}
            </div>

            {/* Instructor Details Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Instructor
              </h4>
              <div className="flex items-center gap-3">
                <img
                  src={
                    course.instructor?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      course.instructor?.name || 'Instructor'
                    )}`
                  }
                  alt={course.instructor?.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {course.instructor?.name}
                  </h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {course.instructor?.headline || 'Course Author & Senior Educator'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.instructor?.bio ||
                  'Dedicated educator committed to transforming complex technology into approachable, real-world skills.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Free Video Preview Modal */}
      {previewLesson && (
        <Modal
          isOpen={!!previewLesson}
          onClose={() => setPreviewLesson(null)}
          title={previewLesson.title}
          maxWidth="max-w-3xl"
        >
          <div className="aspect-video bg-black rounded-xl overflow-hidden">
            <video
              src={previewLesson.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
