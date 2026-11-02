# EduSphere REST API Reference (v1)

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication Endpoints (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Registers learner or instructor. Body: `{ name, email, password, confirmPassword, role }`. Prevents admin self-registration. |
| `POST` | `/auth/login` | Public | Authenticates credentials, returns JWT access token & sets HTTP-only cookies. |
| `POST` | `/auth/logout` | Public | Clears access and refresh authentication cookies. |
| `POST` | `/auth/refresh` | Public | Exchanges valid refresh cookie/token for new access token. |
| `POST` | `/auth/forgot-password` | Public | Dispatches single-use password recovery token via email. |
| `POST` | `/auth/reset-password` | Public | Resets user password using single-use verification token. |
| `GET` | `/auth/me` | Authenticated | Retrieves current logged in user profile. |
| `PATCH`| `/auth/profile` | Authenticated | Updates name, headline, bio, or avatar. |
| `PATCH`| `/auth/change-password` | Authenticated | Validates current password and updates to new password. |

---

## 2. Course Endpoints (`/courses`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/courses` | Public | Lists published courses with search, category, difficulty, pricing, sort, and pagination. |
| `GET` | `/courses/categories` | Public | Lists active taxonomy categories with course counts. |
| `GET` | `/courses/:slug` | Public / Optional | Retrieves full course details, reviews, and preview curriculum. |
| `GET` | `/courses/:courseId/curriculum` | Enrolled / Instructor / Admin | Retrieves protected curriculum with full video URLs and learning materials. |
| `GET` | `/courses/instructor/my-courses` | Instructor / Admin | Lists all courses authored by the authenticated instructor. |
| `POST` | `/courses` | Instructor / Admin | Creates a new course draft. |
| `PATCH`| `/courses/:id` | Instructor / Admin | Updates course metadata (enforces course ownership). |
| `DELETE`| `/courses/:id` | Instructor / Admin | Deletes course and associated sections, lessons, and reviews. |
| `POST` | `/courses/:id/submit` | Instructor / Admin | Validates course completeness and submits for admin review. |

---

## 3. Sections & Lessons Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/courses/:courseId/sections` | Instructor / Admin | Appends a new curriculum section. |
| `PATCH`| `/courses/sections/:id` | Instructor / Admin | Modifies section title or order index. |
| `DELETE`| `/courses/sections/:id` | Instructor / Admin | Removes section and cascading lessons. |
| `POST` | `/courses/sections/:sectionId/lessons` | Instructor / Admin | Creates a video or article lesson. |
| `PATCH`| `/courses/lessons/:id` | Instructor / Admin | Modifies lesson details and video duration. |
| `DELETE`| `/courses/lessons/:id` | Instructor / Admin | Removes lesson and updates course metadata. |

---

## 4. Enrollment & Learning Progress Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/enrollments/free` | Authenticated | Enrolls student into free course and initializes Progress document. |
| `GET` | `/enrollments/my-courses` | Authenticated | Lists all enrolled courses with completion percentages. |
| `GET` | `/enrollments/check/:courseId` | Authenticated | Checks if user is currently enrolled in a course. |
| `GET` | `/progress/courses/:courseId` | Authenticated | Retrieves lesson completion history and playback positions. |
| `PATCH`| `/progress/courses/:courseId/lessons/:lessonId` | Authenticated | Updates playback seconds and marks lesson complete. |

---

## 5. Assessments & Quizzes Endpoints (`/quizzes`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/quizzes/courses/:courseId` | Authenticated | Lists active assessments for course. |
| `GET` | `/quizzes/:id` | Authenticated | Retrieves quiz questions (sanitized: hides `isCorrect` from students). |
| `POST` | `/quizzes/:id/submit` | Authenticated | Evaluates student answers on backend, calculates percentage and pass/fail verdict. |
| `GET` | `/quizzes/:id/attempts` | Authenticated | Lists prior attempts by student. |
| `POST` | `/quizzes/courses/:courseId` | Instructor / Admin | Creates new quiz with duration and passing threshold. |
| `POST` | `/quizzes/:id/questions` | Instructor / Admin | Adds question with options, explanation, and marks. |

---

## 6. Assignments Endpoints (`/assignments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/assignments/courses/:courseId` | Authenticated | Lists assignments and student's submission status. |
| `GET` | `/assignments/:id` | Authenticated | Retrieves assignment instructions and references. |
| `POST` | `/assignments/:id/submit` | Student | Submits student work (files and notes). |
| `GET` | `/assignments/:id/submissions` | Instructor / Admin | Lists student submissions for an assignment. |
| `PATCH`| `/assignments/submissions/:submissionId/grade` | Instructor / Admin | Grades student submission with score and qualitative feedback. |

---

## 7. Certificates Endpoints (`/certificates`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/certificates/my-certificates` | Student | Lists all earned accredited certificates. |
| `POST` | `/certificates/generate` | Student | Generates PDF certificate after verifying 100% course completion. |
| `GET` | `/certificates/verify/:certificateId` | Public | Public credential ledger to verify certificate authenticity. |

---

## 8. Payments Endpoints (`/payments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/payments/create-order` | Authenticated | Creates Razorpay order for paid course. |
| `POST` | `/payments/verify` | Authenticated | Validates cryptographic HMAC-SHA256 signature and enrolls student. |
| `GET` | `/payments/my-transactions` | Authenticated | Lists payment transaction history. |

---

## 9. Administrator Controls (`/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/admin/dashboard` | Admin Only | Retrieves platform KPI statistics and monthly growth metrics. |
| `GET` | `/admin/users` | Admin Only | Searches and filters user directory. |
| `PATCH`| `/admin/users/:id/status` | Admin Only | Toggles user status between active and suspended (+ audit log). |
| `GET` | `/admin/courses/pending` | Admin Only | Lists courses submitted for admin review. |
| `PATCH`| `/admin/courses/:id/approval` | Admin Only | Approves or rejects courses with reason (+ audit log). |
| `POST` | `/admin/categories` | Admin Only | Creates new course category (+ audit log). |
| `GET` | `/admin/reviews` | Admin Only | Lists reviews across platform for moderation. |
| `DELETE`| `/admin/reviews/:id` | Admin Only | Removes abusive or inappropriate review (+ audit log). |
| `GET` | `/admin/audit-logs` | Admin Only | Retrieves chronological audit trail of all governance operations. |
