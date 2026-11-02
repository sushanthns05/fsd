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
  Assignment,
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
      Assignment.deleteMany({}),
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
      courseCount: 2,
    });

    const catAI = await Category.create({
      name: 'Data Science & AI',
      slug: 'data-science-ai',
      description: 'Explore neural networks, machine learning models, Python analytics, and deep learning.',
      icon: 'Brain',
      courseCount: 1,
    });

    const catCloud = await Category.create({
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Continuous integration, containerization with Docker, Kubernetes, and AWS architecture.',
      icon: 'Cloud',
      courseCount: 1,
    });

    const catCyber = await Category.create({
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Penetration testing, network defense, ethical hacking, and enterprise security policies.',
      icon: 'Shield',
      courseCount: 0,
    });

    const catUIUX = await Category.create({
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Design systems, Figma wireframing, user psychology, and interactive prototyping.',
      icon: 'Layout',
      courseCount: 0,
    });

    const catMobile = await Category.create({
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Build native iOS and Android apps using React Native, Flutter, and Swift.',
      icon: 'Smartphone',
      courseCount: 0,
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
      type: 'article',
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
    await Assignment.create({
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
      type: 'article',
      contentBody: `### Implementing Dark Mode in Modern Web Apps\n\nDark mode has evolved from a novelty feature into a vital accessibility consideration. Prolonged screen time causes eye strain, and high-contrast dark themes offer substantial relief in low-light environments.\n\nIn Tailwind CSS, enabling dark mode is straightforward:\n1. Configure \`darkMode: 'class'\` in your \`tailwind.config.js\`.\n2. Apply the \`dark:\` modifier to text and background classes.\n3. Store user theme preference in \`localStorage\` to persist settings across sessions.`,
      isPreviewAllowed: false,
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

    console.log('[Seed Engine] Seeding Enrollments & Learning Progress for Liam...');
    // Enroll Liam in Course 1 (Paid) and Course 2 (Free)
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

    const enroll1 = await Enrollment.create({
      student: student1._id,
      course: course1._id,
      status: 'completed',
      pricePaid: 1999,
      payment: payment1._id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    // Complete all 4 lessons of Course 1 for Liam
    const certId1 = generateCertificateId();
    const certPdfUrl = await generateCertificatePDF({
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
      pdfUrl: certPdfUrl,
      issueDate: new Date(),
      gradePercentage: 100,
    });

    await Progress.create({
      student: student1._id,
      course: course1._id,
      completedLessons: [lesson1_1._id, lesson1_2._id, lesson1_3._id, lesson1_4._id],
      lessonProgress: [
        { lesson: lesson1_1._id, lastPositionSeconds: 720, completedAt: new Date() },
        { lesson: lesson1_2._id, lastPositionSeconds: 940, completedAt: new Date() },
        { lesson: lesson1_3._id, lastPositionSeconds: 1100, completedAt: new Date() },
        { lesson: lesson1_4._id, lastPositionSeconds: 0, completedAt: new Date() },
      ],
      percentCompleted: 100,
      isCompleted: true,
      certificate: cert1._id,
    });

    // Enroll Liam in Course 2 (Free) - in progress at 33%
    await Enrollment.create({
      student: student1._id,
      course: course2._id,
      status: 'active',
      pricePaid: 0,
    });

    await Progress.create({
      student: student1._id,
      course: course2._id,
      completedLessons: [sec2_1._id], // completed 1 lesson
      lessonProgress: [],
      percentCompleted: 33,
      isCompleted: false,
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
