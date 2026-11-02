# EduSphere — Smart Online Learning Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-68a063?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> **EduSphere** is an enterprise-grade, full-stack online learning platform (MERN stack) engineered with a micro-modular monolith architecture. It features end-to-end integration across three user personas: **Students**, **Instructors**, and **Administrators**, providing cryptographic JWT session management, video learning with playback persistence, server-side assessment engines, capstone assignment grading, verified PDF certificate generation, and an Indian-ready payment architecture (Razorpay).

---

## 🌟 Key Platform Capabilities

- **🔐 Enterprise Security & RBAC**:
  - Cryptographic password hashing with `bcryptjs`.
  - HTTP-Only, SameSite, Secure cookie-based JWT access and refresh tokens.
  - Strict server-side role validation (`student`, `instructor`, `admin`).
  - Zero-exposure: sensitive keys, passwords, and correct answers are never leaked.
  - Helmet security headers, rate-limiting, and Zod input validation.

- **🎓 Student Experience**:
  - Public course catalog with debounced search, category multi-filters, difficulty, pricing, and rating sorting.
  - Interactive Course Player with auto-resume, playback speed control (0.75x - 2x), and progress tracking.
  - Timed Quiz engine with server-side validation and question navigation.
  - Project assignment portal with file uploads and instructor feedback viewing.
  - Automated PDF Certificate issuance and public credential verification ledger.

- **👨‍🏫 Instructor Studio**:
  - Draft course authoring with curriculum builder (sections, video lessons, articles).
  - Assessment management: create timed quizzes with multiple-choice questions.
  - Assignment creation with deadlines, max marks, and reference files.
  - Submissions grading portal: award marks, set status, and provide qualitative feedback.

- **👑 Administrator Command Center**:
  - High-level KPIs: Active students, instructors, courses, revenue, and enrollments.
  - Interactive monthly revenue and student velocity charts.
  - User governance: search, filter, and activate/suspend accounts.
  - Course approval workflow: approve or reject courses with feedback reasons.
  - Comprehensive chronological audit trail logging all governance operations.

- **💳 Indian Payment Architecture**:
  - Free course one-click enrollments.
  - Razorpay order creation and HMAC-SHA256 signature verification before committing enrollments.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, React Hook Form, Zod, Lucide React, Recharts, Canvas-Confetti |
| **Backend** | Node.js, Express.js, REST API, JWT, HTTP-Only Cookies, bcryptjs, Multer, Zod, Helmet, Express-Rate-Limit |
| **Database** | MongoDB, Mongoose ODM (with automatic embedded memory-server fallback for zero-config runnability) |
| **Services** | PDFKit (Certificate Generation), Nodemailer, Razorpay API Architecture, Audit Logger |
| **Testing** | Vitest, Supertest, React Testing Library, JSDOM |
| **DevOps** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

EduSphere includes a unified root script to manage both the server and client concurrently:

```bash
# Clone the repository
git clone https://github.com/your-org/edusphere.git
cd edusphere

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment Files

Pre-configured development files are provided out of the box:
```bash
# Server environment
cp server/.env.example server/.env

# Client environment
cp client/.env.example client/.env
```

*(Note: If you do not have MongoDB running locally, the server will automatically launch an embedded in-memory MongoDB instance for zero-configuration testing!)*

### 3. Seed Database with Realistic Demo Data

Run the seeder to populate realistic demo accounts, categories, courses, lessons, quizzes, and certificates:

```bash
npm run seed
```

### 4. Start Development Servers

Run both the Express API and Vite React server concurrently:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **API Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🔑 Demo Credentials

All seeded demo accounts use the standard password: `Password123!`

| Persona | Email | Password | Role / Access Details |
|---|---|---|---|
| **👑 Admin** | `admin@edusphere.io` | `Password123!` | Master Administrator (KPIs, User governance, Approvals, Audit logs) |
| **👨‍🏫 Instructor 1** | `instructor.aris@edusphere.io` | `Password123!` | Principal Architect (Author of MERN Mastery & Tailwind courses) |
| **👩‍🏫 Instructor 2** | `instructor.sophia@edusphere.io` | `Password123!` | AI Research Lead (Author of Machine Learning & DevOps courses) |
| **🎓 Student 1** | `student.liam@edusphere.io` | `Password123!` | Active learner with completed MERN course & issued certificate |
| **🎓 Student 2** | `student.amina@edusphere.io` | `Password123!` | Enrolled learner in progress |

*(Tip: On the `/login` page, you can also click the quick **"Instant Demo Logins"** buttons for one-click access without typing!)*

---

## 🧪 Automated Testing

Both backend integration tests and frontend component tests are fully configured and passing:

```bash
# Run all tests across server and client
npm test

# Run backend API integration tests only (Vitest + Supertest)
npm run test:server

# Run frontend React component tests only (Vitest + Testing Library)
npm run test:client
```

---

## 📁 Repository Structure

```
edusphere/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Common and Course-specific UI components
│   │   ├── context/            # Auth, Theme, and Notification contexts
│   │   ├── layouts/            # PublicLayout and DashboardLayout (Sidebar)
│   │   ├── pages/              # Public, Auth, Student, Instructor, and Admin views
│   │   ├── services/           # Axios instance with auto-refresh interceptors
│   │   ├── styles/             # Tailwind directives and custom scrollbar styles
│   │   └── test/               # React component tests
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend REST API Server (Node + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # DB connector with embedded fallback & environment config
│   │   ├── controllers/        # 13 REST controllers handling all domain logic
│   │   ├── middleware/         # Auth (JWT cookies), RBAC, Zod validation, Multer uploads
│   │   ├── models/             # 19 Mongoose schemas with indexes and relationships
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── services/           # PDFKit certificates, Razorpay crypto verification, audit logs
│   │   ├── utils/              # JWT helpers, slug generators, and database seeder
│   │   └── validators/         # Zod request boundary schemas
│   ├── test/                   # API integration test suite (Vitest + Supertest)
│   ├── server.js               # Express application entry point
│   └── package.json
│
├── docs/                       # Comprehensive Architecture & Technical Guides
│   ├── architecture.md         # Micro-modular monolith architecture document
│   ├── api-documentation.md    # Complete REST API endpoint reference
│   ├── database-design.md      # Database schemas, ER diagram, and indexes
│   └── deployment-guide.md     # Production PaaS and Docker deployment manual
│
├── docker-compose.yml          # Containerized deployment manifest
├── package.json                # Root monorepo orchestrator
└── README.md
```

---

## 📜 Documentation Links

- [System Architecture Specification](docs/architecture.md)
- [REST API Reference](docs/api-documentation.md)
- [Database Schema & ER Diagrams](docs/database-design.md)
- [Deployment & DevOps Manual](docs/deployment-guide.md)

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
