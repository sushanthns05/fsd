import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import {
  User,
  Category,
  Course,
  Section,
  Lesson,
  Quiz,
  Question,
  QuizAttempt,
  Assignment,
  Submission,
  Enrollment,
  Progress,
  Review,
  Certificate,
  Payment,
} from '../models/index.js';
import { generateCertificateId } from './helpers.js';
import { generateCertificatePDF } from '../services/certificateService.js';
import { config } from '../config/environment.js';

export const seedDatabase = async () => {
  try {
    console.log('[Seed Engine] Connecting to database...');
    await connectDB();

    console.log('[Seed Engine] Clearing existing records...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Course.deleteMany({}),
      Section.deleteMany({}),
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      Enrollment.deleteMany({}),
      Progress.deleteMany({}),
      Review.deleteMany({}),
      Certificate.deleteMany({}),
      Payment.deleteMany({}),
    ]);

    console.log('[Seed Engine] Seeding Users...');
    // Password for all demo accounts: "Password123!"
    const admin = await User.create({
      name: 'Eleanor Vance (Admin)',
      email: 'admin@edusphere.io',
      password: 'Password123!',
      role: 'admin',
      headline: 'EduSphere Chief Academic Administrator',
      bio: 'Oversees platform governance, instructor onboarding, curriculum standards, and security compliance.',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    });

    const instructor1 = await User.create({
      name: 'Dr. Aris Thorne',
      email: 'instructor.aris@edusphere.io',
      password: 'Password123!',
      role: 'instructor',
      headline: 'Principal Full Stack Architect & Ex-FAANG Lead',
      bio: 'Author of 4 best-selling tech manuals, specializing in distributed systems, modern React, and resilient Node.js backends.',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    });

    const instructor2 = await User.create({
      name: 'Sophia Chen',
      email: 'instructor.sophia@edusphere.io',
      password: 'Password123!',
      role: 'instructor',
      headline: 'AI Research Engineer & Data Science Practitioner',
      bio: 'Passionate about democratizing machine learning, PyTorch neural networks, and scalable generative AI pipelines.',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    });

    const student1 = await User.create({
      name: 'Liam Miller',
      email: 'student.liam@edusphere.io',
      password: 'Password123!',
      role: 'student',
      headline: 'Aspiring Full Stack Web Developer',
      bio: 'Enthusiastic software engineering student working hard to transition into cloud and frontend engineering.',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    });

    const student2 = await User.create({
      name: 'Amina Patel',
      email: 'student.amina@edusphere.io',
      password: 'Password123!',
      role: 'student',
      headline: 'Data Analyst & Machine Learning Enthusiast',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    });

    const student3 = await User.create({
      name: 'Carlos Ruiz',
      email: 'student.carlos@edusphere.io',
      password: 'Password123!',
      role: 'student',
      headline: 'DevOps & Cloud Computing Trainee',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    });

    console.log('[Seed Engine] Seeding Categories...');
    const catWeb = await Category.create({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Master frontend, backend, full stack frameworks, and modern web architectures.',
      icon: 'Code',
      courseCount: 4,
    });

    const catAI = await Category.create({
      name: 'Data Science & AI',
      slug: 'data-science-ai',
      description: 'Explore neural networks, machine learning models, Python analytics, and deep learning.',
      icon: 'Brain',
      courseCount: 3,
    });

    const catCloud = await Category.create({
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Continuous integration, containerization with Docker, Kubernetes, and AWS architecture.',
      icon: 'Cloud',
      courseCount: 2,
    });

    const catCyber = await Category.create({
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Penetration testing, network defense, ethical hacking, and enterprise security policies.',
      icon: 'Shield',
      courseCount: 1,
    });

    const catUIUX = await Category.create({
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Design systems, Figma wireframing, user psychology, and interactive prototyping.',
      icon: 'Layout',
      courseCount: 1,
    });

    const catMobile = await Category.create({
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Build native iOS and Android apps using React Native, Flutter, and Swift.',
      icon: 'Smartphone',
      courseCount: 1,
    });

    console.log('[Seed Engine] Seeding Courses & Curricula...');

    // COURSE 1: Modern Full Stack React & Node.js Mastery (Paid)
    const course1 = await Course.create({
      title: 'Full Stack MERN Mastery: From Concept to Production',
      slug: 'full-stack-mern-mastery',
      subtitle: 'Build, secure, and deploy high-performance web applications using React 18, Express, and MongoDB.',
      description: `Step into modern enterprise engineering. This comprehensive course guides you through creating a scalable web application from scratch. You will master architectural patterns, RESTful API design, JWT authentication with secure HTTP-only cookies, state management, complex database relationships, and containerized deployment.\n\nThroughout the course, you will build real-world micro-modular services, write automated integration tests, and implement production performance optimizations.`,
      instructor: instructor1._id,
      category: catWeb._id,
      difficulty: 'intermediate',
      language: 'English',
      price: 1999,
      isFree: false,
      discountPrice: 1499,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      objectives: [
        'Design micro-modular Node.js architectures with Express and Mongoose',
        'Implement role-based authorization with cryptographic JWT session management',
        'Create responsive UI components with React, Vite, and Tailwind CSS',
        'Optimize MongoDB queries using indexing and aggregation pipelines',
      ],
      requirements: [
        'Fundamental knowledge of modern JavaScript (ES6+)',
        'Basic familiarity with web development concepts (HTML, CSS, HTTP requests)',
      ],
      targetAudience: [
        'Junior and mid-level web developers wanting to master full-stack MERN engineering',
        'Software engineers preparing for technical system architecture interviews',
      ],
      status: 'published',
      totalLessons: 4,
      totalDurationMinutes: 65,
      ratingAverage: 4.9,
      ratingCount: 18,
      enrolledCount: 142,
    });

    // Sections & Lessons for Course 1
    const sec1_1 = await Section.create({
      course: course1._id,
      title: 'Module 1: Architecture & Foundation',
      description: 'Understanding the MERN stack architecture, setup, and clean project structuring.',
      orderIndex: 0,
    });

    const lesson1_1 = await Lesson.create({
      course: course1._id,
      section: sec1_1._id,
      title: 'Introduction to Modern MERN Architecture',
      description: 'Overview of the monolith vs microservice design, request lifecycle, and security model.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDurationSeconds: 720,
      isPreviewAllowed: true,
      resources: [
        {
          title: 'MERN Architectural Diagram PDF',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileType: 'pdf',
          fileSize: '1.2 MB',
        },
      ],
    });

    const lesson1_2 = await Lesson.create({
      course: course1._id,
      section: sec1_1._id,
      title: 'Configuring Environment Variables & Secure Configs',
      description: 'Zero-leak secret management, validating process.env with Zod, and environment isolation.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      videoDurationSeconds: 940,
      isPreviewAllowed: false,
    });

    const sec1_2 = await Section.create({
      course: course1._id,
      title: 'Module 2: Advanced Auth & Data Modeling',
      description: 'Deep dive into password hashing, token rotation, and schema indexing.',
      orderIndex: 1,
    });

    const lesson1_3 = await Lesson.create({
      course: course1._id,
      section: sec1_2._id,
      title: 'Bulletproof Authentication with HTTP-Only Cookies',
      description: 'Defense against XSS and CSRF attacks using secure cookies and token rotation.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      videoDurationSeconds: 1100,
      isPreviewAllowed: false,
    });

    const lesson1_4 = await Lesson.create({
      course: course1._id,
      section: sec1_2._id,
      title: 'Mongoose Aggregation Pipelines for Dashboard Analytics',
      description: 'Building high-speed real-time metrics using MongoDB aggregation stages ($group, $match, $sort).',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      videoDurationSeconds: 980,
      contentBody: `### Mastering MongoDB Aggregation Pipelines\n\nWhen calculating platform metrics such as total revenue, student growth, and lesson completion rates, doing multiple in-memory operations across thousands of documents is slow and inefficient.\n\nBy leveraging **MongoDB Aggregation Pipelines**, you shift the heavy lifting directly to the database engine.\n\n#### Key Aggregation Stages:\n1. **$match**: Filters documents to pass only matching criteria into subsequent stages.\n2. **$group**: Groups documents by an expression and computes accumulated values ($sum, $avg, $min, $max).\n3. **$sort**: Orders resulting documents with indexed speed.\n4. **$project**: Reshapes each document, adding computed fields or discarding unnecessary ones.\n\n\`\`\`javascript\nconst revenueStats = await Payment.aggregate([\n  { $match: { status: 'successful' } },\n  { $group: { _id: null, totalRevenue: { $sum: '$amount' }, count: { $sum: 1 } } }\n]);\n\`\`\`\n\nAlways ensure that the first stage in your pipeline utilizes existing compound indexes for maximum query throughput!`,
      isPreviewAllowed: false,
    });

    // Quiz for Course 1
    const quiz1 = await Quiz.create({
      course: course1._id,
      section: sec1_1._id,
      title: 'Full Stack Architecture Assessment',
      description: 'Test your understanding of full-stack REST API concepts, HTTP-only cookies, and security best practices.',
      durationMinutes: 10,
      passingPercentage: 70,
      maxAttempts: 3,
      totalMarks: 20,
      questionsCount: 2,
    });

    await Question.create({
      quiz: quiz1._id,
      questionText: 'Why should sensitive JWT tokens be stored in HTTP-Only cookies rather than localStorage?',
      questionType: 'single-choice',
      marks: 10,
      orderIndex: 0,
      explanation: 'HTTP-only cookies cannot be accessed by client-side JavaScript, which protects tokens against Cross-Site Scripting (XSS) attacks.',
      options: [
        { text: 'HTTP-Only cookies prevent client-side JavaScript from reading the token during an XSS attack.', isCorrect: true },
        { text: 'HTTP-Only cookies automatically encrypt the server response payload.', isCorrect: false },
        { text: 'localStorage has a 50KB limit while cookies have no size restriction.', isCorrect: false },
        { text: 'HTTP-Only cookies bypass CORS verification on all browsers.', isCorrect: false },
      ],
    });

    await Question.create({
      quiz: quiz1._id,
      questionText: 'What is the primary benefit of compound indexes in MongoDB?',
      questionType: 'single-choice',
      marks: 10,
      orderIndex: 1,
      explanation: 'Compound indexes index multiple fields simultaneously, accelerating multi-predicate queries (e.g., student + course lookup).',
      options: [
        { text: 'They automatically back up collections across shards.', isCorrect: false },
        { text: 'They optimize queries filtering or sorting across multiple fields in a specific order.', isCorrect: true },
        { text: 'They eliminate the need for Mongoose schemas.', isCorrect: false },
        { text: 'They convert NoSQL documents into SQL relational tables.', isCorrect: false },
      ],
    });

    // Assignment for Course 1
    const assign1 = await Assignment.create({
      course: course1._id,
      section: sec1_2._id,
      title: 'Capstone: Build a Protected REST Endpoint with JWT Verification',
      instructions: `### Assignment Objective\n\nImplement an authenticated route in Node.js that:\n1. Validates incoming JWT tokens from HTTP-only cookies.\n2. Verifies user role permissions against an allowed array.\n3. Returns custom JSON error codes when access is denied.\n\n**Submission Requirement:**\nSubmit a ZIP or PDF containing your commented controller code and a screenshot of your Postman / HTTP client testing the endpoint with both authorized and unauthorized tokens.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
      referenceFiles: [
        {
          name: 'Starter-Auth-Boilerplate.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '250 KB',
        },
      ],
    });

    // COURSE 2: Modern Web Design & Tailwind CSS Mastery (FREE)
    const course2 = await Course.create({
      title: 'Modern UI/UX & Tailwind CSS from Scratch',
      slug: 'modern-ui-ux-tailwind-css',
      subtitle: 'Craft professional, responsive, accessible SaaS interfaces with utility-first CSS.',
      description: 'Discover how to design clean modern web applications without writing bloated custom CSS. Learn responsive grid systems, accessible form controls, dark mode toggling, fluid typography, and interactive components using Tailwind CSS.',
      instructor: instructor1._id,
      category: catWeb._id,
      difficulty: 'beginner',
      language: 'English',
      price: 0,
      isFree: true,
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      objectives: [
        'Master the Tailwind CSS utility-first workflow',
        'Build fully responsive mobile, tablet, and desktop dashboards',
        'Implement accessible contrast ratios and semantic HTML layouts',
      ],
      requirements: ['Basic understanding of HTML and basic CSS'],
      targetAudience: ['Frontend developers, web designers, and aspiring full-stack engineers'],
      status: 'published',
      totalLessons: 3,
      totalDurationMinutes: 42,
      ratingAverage: 4.8,
      ratingCount: 32,
      enrolledCount: 285,
    });

    const sec2_1 = await Section.create({
      course: course2._id,
      title: 'Section 1: Tailwind Fundamentals',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course2._id,
      section: sec2_1._id,
      title: 'The Utility-First Philosophy Explained',
      description: 'Why utility classes increase maintainability and prevent CSS specificity collisions.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
      videoDurationSeconds: 840,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course2._id,
      section: sec2_1._id,
      title: 'Responsive Breakpoints & Flexbox Mastery',
      description: 'Using sm, md, lg, and xl prefixes to build seamless mobile-first layouts.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      videoDurationSeconds: 960,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course2._id,
      section: sec2_1._id,
      title: 'Building Dark Mode & Accessible Design Tokens',
      description: 'Implementing class-based dark mode switching and accessible color palettes.',
      orderIndex: 2,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      videoDurationSeconds: 840,
      contentBody: `### Implementing Dark Mode in Modern Web Apps\n\nDark mode has evolved from a novelty feature into a vital accessibility consideration. Prolonged screen time causes eye strain, and high-contrast dark themes offer substantial relief in low-light environments.\n\nIn Tailwind CSS, enabling dark mode is straightforward:\n1. Configure \`darkMode: 'class'\` in your \`tailwind.config.js\`.\n2. Apply the \`dark:\` modifier to text and background classes.\n3. Store user theme preference in \`localStorage\` to persist settings across sessions.`,
      isPreviewAllowed: false,
    });

    const assign2 = await Assignment.create({
      course: course2._id,
      section: sec2_1._id,
      title: 'Project: Responsive SaaS Dashboard & Accessible Dark Mode UI',
      instructions: `### Assignment Objective\n\nBuild a production-quality responsive SaaS dashboard using Tailwind CSS.\n\n**Requirements:**\n1. Implement mobile, tablet, and desktop breakpoints using flexbox and grid.\n2. Configure a class-based dark mode toggle with smooth color transitions.\n3. Verify color contrast ratios to satisfy WCAG AA accessibility standards.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'Dashboard-UI-Spec.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '350 KB',
        },
      ],
    });

    // COURSE 3: Applied Machine Learning & Neural Networks (Paid)
    const course3 = await Course.create({
      title: 'Applied Machine Learning & Deep Neural Networks',
      slug: 'applied-machine-learning-deep-neural-networks',
      subtitle: 'Hands-on training in Python, scikit-learn, PyTorch, and deploying models to cloud APIs.',
      description: 'Go beyond theoretical math into real production ML engineering. Build predictive models, train convolutional neural networks (CNNs), optimize hyperparameters, and expose trained models as low-latency microservice endpoints.',
      instructor: instructor2._id,
      category: catAI._id,
      difficulty: 'advanced',
      language: 'English',
      price: 2499,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      objectives: [
        'Build and train neural networks using PyTorch',
        'Perform exploratory data analysis and feature engineering',
        'Deploy ML models as RESTful prediction APIs',
      ],
      requirements: ['Proficiency with Python and basic linear algebra'],
      targetAudience: ['Data engineers, software engineers, and AI researchers'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 38,
      ratingAverage: 4.9,
      ratingCount: 14,
      enrolledCount: 96,
    });

    const sec3_1 = await Section.create({
      course: course3._id,
      title: 'Section 1: Neural Network Foundations',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course3._id,
      section: sec3_1._id,
      title: 'Forward & Backward Propagation Demystified',
      description: 'Mathematical intuition behind gradient descent, loss functions, and activation curves.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      videoDurationSeconds: 1200,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course3._id,
      section: sec3_1._id,
      title: 'PyTorch Model Definition & Training Loops',
      description: 'Coding custom neural layers, optimizers, and loss metrics.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDurationSeconds: 1080,
      isPreviewAllowed: false,
    });

    const assign3 = await Assignment.create({
      course: course3._id,
      section: sec3_1._id,
      title: 'Project: PyTorch Neural Network Training & REST Model Serving',
      instructions: `### Assignment Objective\n\nTrain a deep learning model in PyTorch and deploy it for live inference.\n\n**Requirements:**\n1. Define custom PyTorch nn.Module architecture with Dropout and BatchNorm.\n2. Train with AdamW optimizer, tracking loss and accuracy metrics per epoch.\n3. Expose model predictions via a RESTful JSON endpoint with input validation.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'PyTorch-Starter-Dataset.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.8 MB',
        },
      ],
    });

    // COURSE 4: Cloud Engineering & Kubernetes Orchestration (Paid)
    const course4 = await Course.create({
      title: 'DevOps & Kubernetes Cloud Orchestration',
      slug: 'devops-kubernetes-cloud-orchestration',
      subtitle: 'Production CI/CD pipelines, Docker containerization, Helm charts, and cluster security.',
      description: 'Learn modern DevOps practices implemented by top cloud engineering teams. Automate builds, containerize microservices, manage multi-node Kubernetes clusters, and establish monitoring with Prometheus.',
      instructor: instructor2._id,
      category: catCloud._id,
      difficulty: 'intermediate',
      language: 'English',
      price: 1899,
      isFree: false,
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 30,
      ratingAverage: 4.7,
      ratingCount: 9,
      enrolledCount: 65,
    });

    const sec4_1 = await Section.create({
      course: course4._id,
      title: 'Section 1: Containerization with Docker',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course4._id,
      section: sec4_1._id,
      title: 'Multi-stage Dockerfile Optimization',
      description: 'Creating tiny production images under 50MB with Node.js Alpine base.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      videoDurationSeconds: 900,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course4._id,
      section: sec4_1._id,
      title: 'Kubernetes Pods, Deployments & Service Discovery',
      description: 'Declarative YAML manifests, replica sets, and cluster ingress rules.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      videoDurationSeconds: 900,
      isPreviewAllowed: false,
    });

    const assign4 = await Assignment.create({
      course: course4._id,
      section: sec4_1._id,
      title: 'Project: Multi-Stage Dockerization & Kubernetes Cluster Deployment',
      instructions: `### Assignment Objective\n\nContainerize a production full-stack application and deploy it to a Kubernetes cluster.\n\n**Requirements:**\n1. Write a multi-stage Dockerfile using Alpine Linux that compiles under 50MB.\n2. Write Kubernetes YAML manifests for Deployment, ClusterIP Service, and Ingress.\n3. Implement liveness/readiness probes and rolling zero-downtime updates.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'K8s-Deployment-Manifests.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '420 KB',
        },
      ],
    });

    // COURSE 5: Cybersecurity & Ethical Hacking: Defense in Depth (Paid)
    const course5 = await Course.create({
      title: 'Cybersecurity & Ethical Hacking: Defense in Depth',
      slug: 'cybersecurity-ethical-hacking-defense',
      subtitle: 'Master network penetration testing, web app vulnerabilities (OWASP Top 10), and cryptography.',
      description: 'Protect enterprise infrastructure against modern threat actors. Learn real vulnerability assessments, network sniffing with Wireshark, SQL injection mitigation, cross-site request forgery defense, and automated security scanning tools.',
      instructor: instructor1._id,
      category: catCyber._id,
      difficulty: 'intermediate',
      language: 'English',
      price: 2199,
      isFree: false,
      discountPrice: 1699,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      objectives: [
        'Identify and exploit OWASP Top 10 vulnerabilities in lab environments',
        'Analyze network packets using Wireshark and tcpdump',
        'Implement cryptographic authentication and zero-trust perimeter defenses',
      ],
      requirements: ['Basic networking knowledge (TCP/IP, DNS) and command line familiarity'],
      targetAudience: ['Security analysts, system administrators, and developers building secure systems'],
      status: 'published',
      totalLessons: 3,
      totalDurationMinutes: 45,
      ratingAverage: 4.9,
      ratingCount: 48,
      enrolledCount: 310,
    });

    const sec5_1 = await Section.create({
      course: course5._id,
      title: 'Section 1: Security Mindset & Network Defense',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course5._id,
      section: sec5_1._id,
      title: 'The Zero-Trust Architecture Paradigm',
      description: 'Never trust, always verify: implementing continuous verification across microservices.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      videoDurationSeconds: 780,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course5._id,
      section: sec5_1._id,
      title: 'OWASP Top 10: Deep Dive into SQLi & XSS',
      description: 'Hands-on breakdown of injection attack vectors and parameter sanitization.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      videoDurationSeconds: 1020,
      isPreviewAllowed: false,
    });

    await Lesson.create({
      course: course5._id,
      section: sec5_1._id,
      title: 'Implementing Strict Content Security Policies (CSP)',
      description: 'Mitigating script execution risks with modern HTTP security headers.',
      orderIndex: 2,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoDurationSeconds: 900,
      contentBody: `### Content Security Policy (CSP) Engineering\n\nA Content Security Policy is an effective defense against Cross-Site Scripting (XSS) and data injection attacks.\n\n#### Key Directives:\n- \`default-src 'self'\`: Only allow resources from the origin domain by default.\n- \`script-src 'self' 'nonce-...' \`: Disallow arbitrary inline scripts unless accompanied by a cryptographically generated nonce.\n- \`frame-ancestors 'none'\`: Prevent Clickjacking attacks by forbidding iframe embedding.\n\nUse Helmet in Express.js to enforce these headers at the boundary.`,
      isPreviewAllowed: false,
    });

    const assign5 = await Assignment.create({
      course: course5._id,
      section: sec5_1._id,
      title: 'Project: Web Security Audit & OWASP Top 10 Hardening Blueprint',
      instructions: `### Assignment Objective\n\nPerform a simulated penetration test against an enterprise web service.\n\n**Requirements:**\n1. Identify injection vectors (SQLi, Stored XSS) and document exploitation proofs.\n2. Implement parameterized SQL queries and strict Content Security Policies in Express.\n3. Submit a professional vulnerability assessment report with executive summary.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'Security-Audit-Template.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '512 KB',
        },
      ],
    });

    // COURSE 6: Next.js 14 & Server Components Enterprise Architecture (Paid)
    const course6 = await Course.create({
      title: 'Next.js 14 & Server Components Enterprise Architecture',
      slug: 'nextjs-14-server-components-architecture',
      subtitle: 'Build enterprise-scale full stack web applications with the React App Router, Server Actions, and SSR.',
      description: 'Master the bleeding edge of React and Next.js. Learn Streaming SSR, React Server Components (RSC), optimistic UI updates with Server Actions, dynamic caching strategies, and edge runtime deployment.',
      instructor: instructor1._id,
      category: catWeb._id,
      difficulty: 'advanced',
      language: 'English',
      price: 2499,
      isFree: false,
      discountPrice: 1999,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      objectives: [
        'Architect applications with React Server Components and Client Components boundaries',
        'Implement type-safe Server Actions with Zod validation',
        'Optimize Core Web Vitals using Next.js Image, Font, and streaming suspensions',
      ],
      requirements: ['Solid experience with React (hooks, context) and modern JavaScript'],
      targetAudience: ['Senior frontend engineers and full stack architects transitioning to Next.js'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 36,
      ratingAverage: 5.0,
      ratingCount: 64,
      enrolledCount: 420,
    });

    const sec6_1 = await Section.create({
      course: course6._id,
      title: 'Section 1: App Router & Server Components',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course6._id,
      section: sec6_1._id,
      title: 'Understanding React Server Component Boundaries',
      description: 'How RSC renders zero-bundle-size components on the server and streams HTML to the client.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
      videoDurationSeconds: 1140,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course6._id,
      section: sec6_1._id,
      title: 'Server Actions for Mutations with Optimistic Updates',
      description: 'Eliminating boilerplate REST controllers using type-safe Next.js Server Actions.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      videoDurationSeconds: 1020,
      isPreviewAllowed: false,
    });

    const assign6 = await Assignment.create({
      course: course6._id,
      section: sec6_1._id,
      title: 'Project: Full Stack Next.js 14 App with Server Actions & Streaming',
      instructions: `### Assignment Objective\n\nBuild a modern web app with Next.js 14 App Router.\n\n**Requirements:**\n1. Structure routes with React Server Components and isolated Client boundary leaves.\n2. Use Server Actions for database mutations with optimistic UI rollbacks on error.\n3. Stream high-latency data blocks with Suspense skeletons for optimal Core Web Vitals.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'Next14-Starter-Boilerplate.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '800 KB',
        },
      ],
    });

    // COURSE 7: Figma Design Systems & Modern UI/UX Masterclass (Paid)
    const course7 = await Course.create({
      title: 'Figma Design Systems & Modern UI/UX Masterclass',
      slug: 'figma-design-systems-ui-ux-masterclass',
      subtitle: 'From wireframes to production-grade design systems: auto-layout, variables, and developer handoff.',
      description: 'Bridge the gap between design and engineering. Create high-fidelity design systems with design tokens, component variants, responsive auto-layout, prototype interactions, and accessibility-compliant color contrast.',
      instructor: instructor2._id,
      category: catUIUX._id,
      difficulty: 'beginner',
      language: 'English',
      price: 1499,
      isFree: false,
      discountPrice: 999,
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      objectives: [
        'Build scalable design systems in Figma with variables and component properties',
        'Master nested Auto-Layout to reflect real CSS Flexbox behavior',
        'Generate design tokens for direct handoff to frontend engineers',
      ],
      requirements: ['No prior design experience needed - Figma free account recommended'],
      targetAudience: ['UI/UX designers, product designers, and frontend developers wanting design skills'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 32,
      ratingAverage: 4.8,
      ratingCount: 37,
      enrolledCount: 215,
    });

    const sec7_1 = await Section.create({
      course: course7._id,
      title: 'Section 1: Component Architecture & Auto-Layout',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course7._id,
      section: sec7_1._id,
      title: 'Figma Auto-Layout 5.0: The Complete Workflow',
      description: 'Mastering flex wrapping, gap management, and responsive resizing constraints.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDurationSeconds: 960,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course7._id,
      section: sec7_1._id,
      title: 'Design Tokens & Multi-Brand Theme Variables',
      description: 'Setting up color tokens, spacing scales, and typography styles that match code.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      videoDurationSeconds: 960,
      isPreviewAllowed: false,
    });

    const assign7 = await Assignment.create({
      course: course7._id,
      section: sec7_1._id,
      title: 'Project: Production Figma Design System with Variables & Auto-Layout',
      instructions: `### Assignment Objective\n\nBuild an accessible, multi-brand design system in Figma.\n\n**Requirements:**\n1. Define design tokens for semantic colors, typography scales, and spacing.\n2. Build responsive card, button, and navigation components with nested auto-layout.\n3. Create component variants with interactive hover, active, and disabled states.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'Design-System-Styleguide.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '640 KB',
        },
      ],
    });

    // COURSE 8: React Native & Expo: Cross-Platform iOS & Android Apps (Paid)
    const course8 = await Course.create({
      title: 'React Native & Expo: Cross-Platform Mobile Apps',
      slug: 'react-native-expo-cross-platform-apps',
      subtitle: 'Build native iOS and Android apps with a single React codebase, Expo Router, and camera APIs.',
      description: 'Harness the power of React Native with modern Expo SDK. Build fluid mobile interfaces, implement offline-first persistence with SQLite, integrate native push notifications, and publish to the Apple App Store and Google Play Store.',
      instructor: instructor1._id,
      category: catMobile._id,
      difficulty: 'intermediate',
      language: 'English',
      price: 1999,
      isFree: false,
      discountPrice: 1599,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      objectives: [
        'Build production-ready mobile apps using React Native and Expo',
        'Implement file-based navigation with Expo Router v3',
        'Handle device hardware APIs (Camera, Location, Secure Storage)',
      ],
      requirements: ['Basic proficiency with React and JavaScript ES6+'],
      targetAudience: ['Web developers transitioning to native mobile engineering'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 34,
      ratingAverage: 4.9,
      ratingCount: 29,
      enrolledCount: 180,
    });

    const sec8_1 = await Section.create({
      course: course8._id,
      title: 'Section 1: Native Mobile Fundamentals',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course8._id,
      section: sec8_1._id,
      title: 'Expo Workflow Setup & Native Bridge Concepts',
      description: 'How the React Native bridge and new TurboModules communicate with native Swift/Kotlin.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      videoDurationSeconds: 1040,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course8._id,
      section: sec8_1._id,
      title: 'File-based Routing with Expo Router',
      description: 'Tabs, stacks, and nested modal screens made intuitive with filesystem routing.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      videoDurationSeconds: 1000,
      isPreviewAllowed: false,
    });

    const assign8 = await Assignment.create({
      course: course8._id,
      section: sec8_1._id,
      title: 'Project: Native Mobile App with Expo Router & Hardware APIs',
      instructions: `### Assignment Objective\n\nBuild a cross-platform mobile application using React Native and Expo Router v3.\n\n**Requirements:**\n1. Implement tab and modal navigation with filesystem routing.\n2. Access device Camera and Photo Library with permission checks.\n3. Cache offline user state securely using Expo SecureStore and SQLite.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'Expo-Mobile-Starter.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.2 MB',
        },
      ],
    });

    // COURSE 9: Generative AI & LLM Application Engineering (Paid)
    const course9 = await Course.create({
      title: 'Generative AI & LLM Engineering with LangChain',
      slug: 'generative-ai-llm-engineering-langchain',
      subtitle: 'Build production AI agents, Retrieval-Augmented Generation (RAG) systems, and vector search apps.',
      description: 'Go beyond basic chat prompts into autonomous AI software. Implement document ingestion pipelines with chunking and embeddings, query vector databases like ChromaDB and Pinecone, handle conversational memory, and deploy function-calling agents.',
      instructor: instructor2._id,
      category: catAI._id,
      difficulty: 'advanced',
      language: 'English',
      price: 2799,
      isFree: false,
      discountPrice: 2299,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      objectives: [
        'Build scalable Retrieval Augmented Generation (RAG) pipelines',
        'Store and retrieve semantic embeddings in vector databases',
        'Implement autonomous AI agent loops with tool usage and memory',
      ],
      requirements: ['Python 3.10+ proficiency and familiarity with REST APIs'],
      targetAudience: ['Data scientists, software engineers, and AI builders aiming for production LLMs'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 40,
      ratingAverage: 5.0,
      ratingCount: 52,
      enrolledCount: 390,
    });

    const sec9_1 = await Section.create({
      course: course9._id,
      title: 'Section 1: Semantic Search & Vector Embeddings',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course9._id,
      section: sec9_1._id,
      title: 'Vector Embeddings & Cosine Similarity Intuition',
      description: 'How high-dimensional vectors capture semantic meaning and enable instant context search.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      videoDurationSeconds: 1200,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course9._id,
      section: sec9_1._id,
      title: 'Building a Production RAG Pipeline with LangChain',
      description: 'Recursive character chunking, metadata filtering, and hallucination reduction strategies.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      videoDurationSeconds: 1200,
      isPreviewAllowed: false,
    });

    const assign9 = await Assignment.create({
      course: course9._id,
      section: sec9_1._id,
      title: 'Project: Production RAG System with Vector Search & Conversational Memory',
      instructions: `### Assignment Objective\n\nArchitect and evaluate a Retrieval-Augmented Generation (RAG) system with LangChain.\n\n**Requirements:**\n1. Ingest PDF documentation and split into semantic chunks with overlap.\n2. Index vectors into ChromaDB using embeddings.\n3. Implement conversational retrieval chain with source attribution citations.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'RAG-Ingestion-Dataset.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '2.4 MB',
        },
      ],
    });

    // COURSE 10: Python for Data Analysis & Statistical Modeling (FREE)
    const course10 = await Course.create({
      title: 'Python for Data Analysis & Statistical Modeling',
      slug: 'python-data-analysis-statistical-modeling',
      subtitle: 'Analyze datasets, automate spreadsheets, and build visual dashboards with Pandas, NumPy, and Seaborn.',
      description: 'Start your journey in data science with Python. Clean messy data, aggregate metrics across millions of rows, compute statistical significance, and build publication-grade visualizations.',
      instructor: instructor2._id,
      category: catAI._id,
      difficulty: 'beginner',
      language: 'English',
      price: 0,
      isFree: true,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      objectives: [
        'Clean, transform, and merge multi-table datasets using Pandas DataFrames',
        'Perform array calculations and vectorized mathematical operations with NumPy',
        'Create statistical distribution plots and correlation heatmaps with Seaborn',
      ],
      requirements: ['Basic computer literacy. No programming experience required.'],
      targetAudience: ['Aspiring data analysts, business intelligence professionals, and researchers'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 30,
      ratingAverage: 4.7,
      ratingCount: 85,
      enrolledCount: 610,
    });

    const sec10_1 = await Section.create({
      course: course10._id,
      title: 'Section 1: Data Wrangling with Pandas',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course10._id,
      section: sec10_1._id,
      title: 'DataFrames, Series, and Indexing Essentials',
      description: 'Selecting columns, filtering rows with boolean indexing, and handling null values.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
      videoDurationSeconds: 900,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course10._id,
      section: sec10_1._id,
      title: 'Visualizing Trends with Matplotlib & Seaborn',
      description: 'Creating high-impact line charts, bar plots, and density estimates for stakeholder reporting.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      videoDurationSeconds: 900,
      isPreviewAllowed: true,
    });

    const assign10 = await Assignment.create({
      course: course10._id,
      section: sec10_1._id,
      title: 'Project: Exploratory Data Analysis & Statistical Modeling in Python',
      instructions: `### Assignment Objective\n\nPerform end-to-end data exploration, cleaning, and statistical analysis.\n\n**Requirements:**\n1. Clean nulls, format datetimes, and aggregate categorical variables in Pandas.\n2. Compute correlation matrices and statistical hypothesis p-values.\n3. Plot publication-grade multi-panel charts using Seaborn and Matplotlib.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'Global-Sales-Clean.csv',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '750 KB',
        },
      ],
    });

    // COURSE 11: AWS Solutions Architect Associate Bootcamp (Paid)
    const course11 = await Course.create({
      title: 'AWS Solutions Architect Associate Certification Bootcamp',
      slug: 'aws-solutions-architect-bootcamp',
      subtitle: 'Comprehensive preparation for SAA-C03: EC2, VPC, S3, IAM, DynamoDB, RDS, and CloudFront.',
      description: 'Pass the AWS Solutions Architect Associate exam with confidence. Master core AWS architectural design patterns: high availability, multi-region fault tolerance, decoupled serverless microservices, and cost optimization.',
      instructor: instructor2._id,
      category: catCloud._id,
      difficulty: 'intermediate',
      language: 'English',
      price: 2299,
      isFree: false,
      discountPrice: 1799,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      objectives: [
        'Design resilient, highly available multi-AZ cloud infrastructures on AWS',
        'Configure custom VPC subnets, route tables, and NAT Gateways',
        'Implement IAM security policies and least-privilege access rules',
      ],
      requirements: ['Basic understanding of operating systems and networking fundamentals'],
      targetAudience: ['Cloud engineers, DevOps practitioners, and systems administrators'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 35,
      ratingAverage: 4.8,
      ratingCount: 43,
      enrolledCount: 340,
    });

    const sec11_1 = await Section.create({
      course: course11._id,
      title: 'Section 1: Core Compute & Networking',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course11._id,
      section: sec11_1._id,
      title: 'VPC Design: Public Subnets, Private Subnets & CIDR Blocks',
      description: 'Architecting secure isolated virtual networks and configuring internet gateway routing.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDurationSeconds: 1050,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course11._id,
      section: sec11_1._id,
      title: 'Auto Scaling Groups & Elastic Load Balancing (ALB)',
      description: 'Distributing incoming web traffic across healthy EC2 targets and scaling on CPU thresholds.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      videoDurationSeconds: 1050,
      isPreviewAllowed: false,
    });

    const assign11 = await Assignment.create({
      course: course11._id,
      section: sec11_1._id,
      title: 'Project: High-Availability Multi-AZ AWS Infrastructure Design',
      instructions: `### Assignment Objective\n\nDesign and deploy an enterprise multi-tier AWS infrastructure.\n\n**Requirements:**\n1. Configure custom VPC across 2 Availability Zones with public/private subnets and NAT gateways.\n2. Setup Application Load Balancer with SSL termination and target groups.\n3. Implement Auto Scaling Groups with dynamic CPU utilization scaling policies.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'AWS-Architecture-Blueprint.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '980 KB',
        },
      ],
    });

    // COURSE 12: TypeScript from Scratch: Production Type Systems (FREE)
    const course12 = await Course.create({
      title: 'TypeScript from Scratch: Production Type Systems',
      slug: 'typescript-production-type-systems',
      subtitle: 'Eliminate runtime JavaScript bugs: Generics, Union types, narrowing, and type-level programming.',
      description: 'Supercharge your JavaScript development with strict typing. Learn why top engineering teams standardize on TypeScript. Master generic functions, branded types, keyof lookups, utility types (Partial, Pick, Omit), and schema typing with Zod.',
      instructor: instructor1._id,
      category: catWeb._id,
      difficulty: 'beginner',
      language: 'English',
      price: 0,
      isFree: true,
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
      trailerVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      objectives: [
        'Write clean, strictly typed TypeScript code that catches errors at compile time',
        'Create reusable generic components, interfaces, and function signatures',
        'Integrate TypeScript seamlessly with React components and Express REST APIs',
      ],
      requirements: ['Familiarity with standard JavaScript (ES6 syntax)'],
      targetAudience: ['Frontend, backend, and full-stack developers transitioning to TypeScript'],
      status: 'published',
      totalLessons: 2,
      totalDurationMinutes: 28,
      ratingAverage: 4.9,
      ratingCount: 98,
      enrolledCount: 750,
    });

    const sec12_1 = await Section.create({
      course: course12._id,
      title: 'Section 1: The TypeScript Type Engine',
      orderIndex: 0,
    });

    await Lesson.create({
      course: course12._id,
      section: sec12_1._id,
      title: 'Type Inference, Union Types & Exhaustive Narrowing',
      description: 'Understanding type guards, discriminated unions, and never-type exhaustive checking.',
      orderIndex: 0,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      videoDurationSeconds: 840,
      isPreviewAllowed: true,
    });

    await Lesson.create({
      course: course12._id,
      section: sec12_1._id,
      title: 'Generics & Advanced Utility Types Deep Dive',
      description: 'Building type-safe abstractions with Generic T, Pick, Record, and ReturnType.',
      orderIndex: 1,
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      videoDurationSeconds: 840,
      isPreviewAllowed: true,
    });

    const assign12 = await Assignment.create({
      course: course12._id,
      section: sec12_1._id,
      title: 'Project: Type-Safe Domain Architecture with TypeScript Generics & Zod',
      instructions: `### Assignment Objective\n\nDesign a resilient, strictly-typed enterprise domain architecture in TypeScript.\n\n**Requirements:**\n1. Create generic entity repositories with CRUD type constraints.\n2. Use discriminated union types with exhaustive pattern matching switch statements.\n3. Infer runtime Zod schemas into compile-time TypeScript types without duplication.`,
      totalMarks: 100,
      passingMarks: 60,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      referenceFiles: [
        {
          name: 'TS-Starter-Boilerplate.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '310 KB',
        },
      ],
    });

    console.log('[Seed Engine] Seeding Enrollments, Submissions & Grade Points for Students...');

    // -------------------------------------------------------------
    // STUDENT 1: LIAM MILLER (Full Stack Specialist)
    // -------------------------------------------------------------
    const payment1 = await Payment.create({
      user: student1._id,
      course: course1._id,
      orderId: 'order_seed_demo_101',
      paymentId: 'pay_seed_demo_101',
      signature: 'mock_sig_seed_verified',
      amount: 1999,
      currency: 'INR',
      status: 'successful',
      method: 'upi',
    });

    const certId1 = generateCertificateId();
    const certPdfUrl1 = await generateCertificatePDF({
      certificateId: certId1,
      studentName: student1.name,
      courseTitle: course1.title,
      instructorName: instructor1.name,
      issueDate: new Date(),
      verificationUrl: `${config.clientUrl}/verify/${certId1}`,
    });

    const cert1 = await Certificate.create({
      certificateId: certId1,
      student: student1._id,
      course: course1._id,
      studentName: student1.name,
      courseTitle: course1.title,
      instructorName: instructor1.name,
      verificationUrl: `${config.clientUrl}/verify/${certId1}`,
      pdfUrl: certPdfUrl1,
      issueDate: new Date(),
      gradePercentage: 100,
    });

    // Course 1 (MERN)
    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      status: 'completed',
      pricePaid: 1999,
      payment: payment1._id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      student: student1._id,
      course: course1._id,
      completedLessons: [lesson1_1._id, lesson1_2._id, lesson1_3._id, lesson1_4._id],
      lessonProgress: [
        { lesson: lesson1_1._id, lastPositionSeconds: 720, completedAt: new Date() },
        { lesson: lesson1_2._id, lastPositionSeconds: 940, completedAt: new Date() },
        { lesson: lesson1_3._id, lastPositionSeconds: 1100, completedAt: new Date() },
        { lesson: lesson1_4._id, lastPositionSeconds: 980, completedAt: new Date() },
      ],
      percentCompleted: 100,
      isCompleted: true,
      certificate: cert1._id,
    });

    await Submission.create({
      assignment: assign1._id,
      student: student1._id,
      course: course1._id,
      submissionFiles: [
        {
          name: 'liam_mern_auth_capstone.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '2.1 MB',
        },
      ],
      studentNotes: 'Implemented JWT token rotation in HTTP-only cookies, password hashing with bcrypt, and comprehensive Supertest suite.',
      marksAwarded: 98,
      status: 'graded',
      feedback: 'Flawless JWT authentication implementation with secure HTTP-only cookie session handling. Clean modular middleware architecture and robust error boundary.',
      gradedBy: instructor1._id,
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Course 2 (Tailwind)
    await Enrollment.create({
      student: student1._id,
      course: course2._id,
      status: 'completed',
      pricePaid: 0,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      student: student1._id,
      course: course2._id,
      completedLessons: [sec2_1._id],
      lessonProgress: [],
      percentCompleted: 100,
      isCompleted: true,
    });

    await Submission.create({
      assignment: assign2._id,
      student: student1._id,
      course: course2._id,
      submissionFiles: [
        {
          name: 'liam_tailwind_saas_dashboard.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.4 MB',
        },
      ],
      studentNotes: 'Built modern dashboard with responsive auto-wrapping grid and class-based dark mode toggle persisted in local storage.',
      marksAwarded: 94,
      status: 'graded',
      feedback: 'Superb responsive layout utilizing Tailwind flex and grid utilities. Accessible color contrast ratios and smooth dark mode theme transitions.',
      gradedBy: instructor1._id,
      gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Course 6 (Next.js 14)
    await Enrollment.create({
      student: student1._id,
      course: course6._id,
      status: 'active',
      pricePaid: 1999,
    });

    await Progress.create({
      student: student1._id,
      course: course6._id,
      completedLessons: [sec6_1._id],
      lessonProgress: [],
      percentCompleted: 80,
      isCompleted: false,
    });

    await Submission.create({
      assignment: assign6._id,
      student: student1._id,
      course: course6._id,
      submissionFiles: [
        {
          name: 'liam_next14_server_actions.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '3.2 MB',
        },
      ],
      studentNotes: 'Implemented Next.js 14 App Router, streaming Suspense boundaries, and Zod validated Server Actions with optimistic rollbacks.',
      marksAwarded: 91,
      status: 'graded',
      feedback: 'Great use of React Server Components and Server Actions. Mutation handling was clean and optimistic UI updates were responsive.',
      gradedBy: instructor1._id,
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Course 12 (TypeScript)
    await Enrollment.create({
      student: student1._id,
      course: course12._id,
      status: 'completed',
      pricePaid: 0,
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      student: student1._id,
      course: course12._id,
      completedLessons: [sec12_1._id],
      lessonProgress: [],
      percentCompleted: 100,
      isCompleted: true,
    });

    await Submission.create({
      assignment: assign12._id,
      student: student1._id,
      course: course12._id,
      submissionFiles: [
        {
          name: 'liam_typescript_domain_models.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '850 KB',
        },
      ],
      studentNotes: 'Modeled complete e-commerce domain using generic repositories, discriminated unions, and Zod schema inference.',
      marksAwarded: 96,
      status: 'graded',
      feedback: 'Brilliant type narrowing and generic constraints. Passed all strict compiler flags with zero any types.',
      gradedBy: instructor1._id,
      gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // -------------------------------------------------------------
    // STUDENT 2: AMINA PATEL (Data Science & AI Specialist)
    // -------------------------------------------------------------
    // Course 3 (Applied ML)
    await Enrollment.create({
      student: student2._id,
      course: course3._id,
      status: 'active',
      pricePaid: 2499,
    });

    await Progress.create({
      student: student2._id,
      course: course3._id,
      completedLessons: [sec3_1._id],
      lessonProgress: [],
      percentCompleted: 100,
      isCompleted: true,
    });

    await Submission.create({
      assignment: assign3._id,
      student: student2._id,
      course: course3._id,
      submissionFiles: [
        {
          name: 'amina_pytorch_cnn_model.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '4.5 MB',
        },
      ],
      studentNotes: 'Trained PyTorch CNN on image classification benchmark with AdamW optimizer and deployed with FastAPI endpoint.',
      marksAwarded: 95,
      status: 'graded',
      feedback: 'Superb PyTorch convolutional network design. Loss converged smoothly and inference latency is under 25ms.',
      gradedBy: instructor2._id,
      gradedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    // Course 5 (Cybersecurity)
    await Enrollment.create({
      student: student2._id,
      course: course5._id,
      status: 'active',
      pricePaid: 1699,
    });

    await Progress.create({
      student: student2._id,
      course: course5._id,
      completedLessons: [sec5_1._id],
      lessonProgress: [],
      percentCompleted: 90,
      isCompleted: false,
    });

    await Submission.create({
      assignment: assign5._id,
      student: student2._id,
      course: course5._id,
      submissionFiles: [
        {
          name: 'amina_security_audit_report.pdf',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.1 MB',
        },
      ],
      studentNotes: 'Conducted automated and manual vulnerability assessment in isolated testbed. Implemented strict CSP and parameter sanitization.',
      marksAwarded: 92,
      status: 'graded',
      feedback: 'Thorough penetration testing report covering OWASP Top 10 vulnerabilities with precise mitigation blueprints.',
      gradedBy: instructor1._id,
      gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Course 9 (Generative AI)
    await Enrollment.create({
      student: student2._id,
      course: course9._id,
      status: 'active',
      pricePaid: 2299,
    });

    await Progress.create({
      student: student2._id,
      course: course9._id,
      completedLessons: [sec9_1._id],
      lessonProgress: [],
      percentCompleted: 100,
      isCompleted: true,
    });

    await Submission.create({
      assignment: assign9._id,
      student: student2._id,
      course: course9._id,
      submissionFiles: [
        {
          name: 'amina_langchain_rag_pipeline.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '2.8 MB',
        },
      ],
      studentNotes: 'Implemented recursive character text splitter, OpenAI embeddings in ChromaDB, and conversational retrieval chain.',
      marksAwarded: 97,
      status: 'graded',
      feedback: 'Outstanding LangChain RAG pipeline with ChromaDB vector embeddings and context-aware chat memory.',
      gradedBy: instructor2._id,
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Course 10 (Python Data)
    await Enrollment.create({
      student: student2._id,
      course: course10._id,
      status: 'completed',
      pricePaid: 0,
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      student: student2._id,
      course: course10._id,
      completedLessons: [sec10_1._id],
      lessonProgress: [],
      percentCompleted: 100,
      isCompleted: true,
    });

    await Submission.create({
      assignment: assign10._id,
      student: student2._id,
      course: course10._id,
      submissionFiles: [
        {
          name: 'amina_python_eda_analysis.ipynb',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.9 MB',
        },
      ],
      studentNotes: 'Performed end-to-end EDA on 100k row sales dataset, handled missing values, and built executive visualization report.',
      marksAwarded: 90,
      status: 'graded',
      feedback: 'Clean data transformation pipeline with Pandas and insightful correlation heatmaps in Seaborn.',
      gradedBy: instructor2._id,
      gradedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    });

    // -------------------------------------------------------------
    // STUDENT 3: CARLOS RUIZ (DevOps & Mobile Specialist)
    // -------------------------------------------------------------
    // Course 4 (DevOps & K8s)
    await Enrollment.create({
      student: student3._id,
      course: course4._id,
      status: 'active',
      pricePaid: 1899,
    });

    await Progress.create({
      student: student3._id,
      course: course4._id,
      completedLessons: [sec4_1._id],
      lessonProgress: [],
      percentCompleted: 100,
      isCompleted: true,
    });

    await Submission.create({
      assignment: assign4._id,
      student: student3._id,
      course: course4._id,
      submissionFiles: [
        {
          name: 'carlos_docker_k8s_deploy.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '1.2 MB',
        },
      ],
      studentNotes: 'Created multi-stage Alpine Dockerfile, written YAML manifests for Deployment, Service, and Ingress with health checks.',
      marksAwarded: 93,
      status: 'graded',
      feedback: 'Clean multi-stage Docker build under 42MB. Kubernetes manifests deployed with zero downtime rolling updates.',
      gradedBy: instructor2._id,
      gradedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    // Course 7 (Figma UI/UX)
    await Enrollment.create({
      student: student3._id,
      course: course7._id,
      status: 'active',
      pricePaid: 999,
    });

    await Progress.create({
      student: student3._id,
      course: course7._id,
      completedLessons: [sec7_1._id],
      lessonProgress: [],
      percentCompleted: 85,
      isCompleted: false,
    });

    await Submission.create({
      assignment: assign7._id,
      student: student3._id,
      course: course7._id,
      submissionFiles: [
        {
          name: 'carlos_figma_design_system.fig',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '3.6 MB',
        },
      ],
      studentNotes: 'Designed design system with color variables, spacing tokens, and nested auto-layout card components.',
      marksAwarded: 88,
      status: 'graded',
      feedback: 'Strong component auto-layout and typography scale. Variables could be organized into more modular collections.',
      gradedBy: instructor2._id,
      gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Course 8 (React Native)
    await Enrollment.create({
      student: student3._id,
      course: course8._id,
      status: 'active',
      pricePaid: 1599,
    });

    await Progress.create({
      student: student3._id,
      course: course8._id,
      completedLessons: [sec8_1._id],
      lessonProgress: [],
      percentCompleted: 95,
      isCompleted: false,
    });

    await Submission.create({
      assignment: assign8._id,
      student: student3._id,
      course: course8._id,
      submissionFiles: [
        {
          name: 'carlos_expo_mobile_app.zip',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '4.1 MB',
        },
      ],
      studentNotes: 'Built cross-platform app with Expo Router v3, Camera API integration, and SQLite persistence.',
      marksAwarded: 94,
      status: 'graded',
      feedback: 'Expo Router navigation runs smooth at 60fps on both iOS and Android emulators. Hardware permissions handled gracefully.',
      gradedBy: instructor1._id,
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Course 11 (AWS Cloud) - Submitted / PENDING GRADING!
    await Enrollment.create({
      student: student3._id,
      course: course11._id,
      status: 'active',
      pricePaid: 1799,
    });

    await Progress.create({
      student: student3._id,
      course: course11._id,
      completedLessons: [sec11_1._id],
      lessonProgress: [],
      percentCompleted: 70,
      isCompleted: false,
    });

    await Submission.create({
      assignment: assign11._id,
      student: student3._id,
      course: course11._id,
      submissionFiles: [
        {
          name: 'carlos_aws_vpc_alb_cloudformation.yaml',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: '150 KB',
        },
      ],
      studentNotes: 'Finished the multi-AZ VPC CloudFormation template, ALB setup, and auto-scaling group. Ready for instructor evaluation.',
      marksAwarded: null,
      status: 'submitted',
      submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    });

    // Seed Reviews
    await Review.create({
      course: course1._id,
      student: student1._id,
      rating: 5,
      comment: 'Aris is an extraordinary instructor. The explanation of JWT token rotation with secure HTTP-only cookies and MERN architecture was the clearest I have ever encountered anywhere online!',
      isApproved: true,
    });

    await Review.create({
      course: course2._id,
      student: student2._id,
      rating: 5,
      comment: 'Incredible beginner-friendly introduction to Tailwind CSS! Transformed how I style my modern web components.',
      isApproved: true,
    });

    await Review.create({
      course: course5._id,
      student: student3._id,
      rating: 5,
      comment: 'The OWASP Top 10 breakdown and hands-on CSP implementations are gold for anyone building enterprise web apps!',
      isApproved: true,
    });

    await Review.create({
      course: course6._id,
      student: student1._id,
      rating: 5,
      comment: 'Best explanation of Server Components and Server Actions I have seen. Made our team architecture seamless.',
      isApproved: true,
    });

    await Review.create({
      course: course7._id,
      student: student2._id,
      rating: 5,
      comment: 'Sophia makes Figma variables and auto-layout feel so natural. My handoff to devs has never been smoother.',
      isApproved: true,
    });

    await Review.create({
      course: course9._id,
      student: student1._id,
      rating: 5,
      comment: 'The RAG pipeline breakdown with LangChain and vector databases was comprehensive and production-ready.',
      isApproved: true,
    });

    await Review.create({
      course: course12._id,
      student: student3._id,
      rating: 5,
      comment: 'Finally understood TypeScript generics and utility types. Highly recommended for every JavaScript developer.',
      isApproved: true,
    });

    console.log('===============================================================');
    console.log('✅ EduSphere Database Successfully Seeded!');
    console.log('===============================================================');
    console.log('Demo Credentials for Immediate Login:');
    console.log('---------------------------------------------------------------');
    console.log('👑 Admin:');
    console.log('   Email:    admin@edusphere.io');
    console.log('   Password: Password123!');
    console.log('');
    console.log('👨‍🏫 Instructor 1:');
    console.log('   Email:    instructor.aris@edusphere.io');
    console.log('   Password: Password123!');
    console.log('');
    console.log('👩‍🏫 Instructor 2:');
    console.log('   Email:    instructor.sophia@edusphere.io');
    console.log('   Password: Password123!');
    console.log('');
    console.log('🎓 Student 1 (Completed MERN Course & Certificate Issued):');
    console.log('   Email:    student.liam@edusphere.io');
    console.log('   Password: Password123!');
    console.log('');
    console.log('🎓 Student 2:');
    console.log('   Email:    student.amina@edusphere.io');
    console.log('   Password: Password123!');
    console.log('===============================================================');
  } catch (err) {
    console.error('[Seed Engine Error]:', err);
    throw err;
  }
};

// If run directly from CLI (e.g., "node src/utils/seed.js")
if (process.argv[1]?.includes('seed.js')) {
  seedDatabase()
    .then(async () => {
      await closeDB();
      process.exit(0);
    })
    .catch(async (err) => {
      await closeDB();
      process.exit(1);
    });
}
