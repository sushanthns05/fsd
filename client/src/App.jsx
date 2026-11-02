import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleGuard } from './components/common/RoleGuard';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailsPage } from './pages/public/CourseDetailsPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { VerifyCertificatePage } from './pages/public/VerifyCertificatePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyCoursesPage } from './pages/student/MyCoursesPage';
import { CoursePlayerPage } from './pages/student/CoursePlayerPage';
import { QuizPage } from './pages/student/QuizPage';
import { QuizResultsPage } from './pages/student/QuizResultsPage';
import { AssignmentsPage } from './pages/student/AssignmentsPage';
import { CertificatesPage } from './pages/student/CertificatesPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Instructor Pages
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { InstructorCoursesPage } from './pages/instructor/InstructorCoursesPage';
import { CreateCoursePage } from './pages/instructor/CreateCoursePage';
import { CurriculumBuilderPage } from './pages/instructor/CurriculumBuilderPage';
import { SubmissionsGradingPage } from './pages/instructor/SubmissionsGradingPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { CourseApprovalPage } from './pages/admin/CourseApprovalPage';
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage';
import { ReviewModerationPage } from './pages/admin/ReviewModerationPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

export function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/verify/:certificateId?" element={<VerifyCertificatePage />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Standalone Protected Learning Experience */}
      <Route element={<ProtectedRoute />}>
        <Route path="/learn/:courseId" element={<CoursePlayerPage />} />
        <Route path="/student/quiz/:id" element={<QuizPage />} />
        <Route path="/student/quiz/:id/results" element={<QuizResultsPage />} />
      </Route>

      {/* Protected Dashboards (with Sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Student Hub */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/my-courses" element={<MyCoursesPage />} />
          <Route path="/student/assignments" element={<AssignmentsPage />} />
          <Route path="/student/certificates" element={<CertificatesPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />

          {/* Instructor Hub */}
          <Route element={<RoleGuard allowedRoles={['instructor', 'admin']} />}>
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
            <Route path="/instructor/courses/create" element={<CreateCoursePage />} />
            <Route path="/instructor/courses/:id/curriculum" element={<CurriculumBuilderPage />} />
            <Route path="/instructor/submissions" element={<SubmissionsGradingPage />} />
          </Route>

          {/* Admin Hub */}
          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/courses/pending" element={<CourseApprovalPage />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
            <Route path="/admin/reviews" element={<ReviewModerationPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
