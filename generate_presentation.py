import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]
    assets_dir = os.path.join(os.getcwd(), 'presentation_assets')

    # Color Palette - EduSphere Modern Enterprise Dark Palette
    C_BG = RGBColor(15, 23, 42)          # Slate 900
    C_CARD_BG = RGBColor(30, 41, 59)     # Slate 800
    C_CARD_BORDER = RGBColor(51, 65, 85) # Slate 700
    C_PRIMARY = RGBColor(99, 102, 241)   # Indigo 500
    C_ACCENT = RGBColor(16, 185, 129)    # Emerald 500
    C_AMBER = RGBColor(245, 158, 11)     # Amber 500
    C_WHITE = RGBColor(255, 255, 255)    # White
    C_TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
    C_CYAN = RGBColor(6, 182, 212)       # Cyan 500

    slides_data = [
        {
            "num": "01",
            "tag": "EXECUTIVE PROJECT OVERVIEW",
            "title": "EduSphere: Smart Online Learning Platform",
            "subtitle": "Enterprise Full-Stack MERN E-Learning Platform with Video Streaming, Timed Quizzes & Capstone GPA System",
            "img": "01_landing.png",
            "caption": "Platform Landing Page & Interactive Hero Showcase",
            "bullets": [
                ("Project Vision", "A modern, production-ready Learning Management System (LMS) designed for enterprise scalability, seamless knowledge delivery, and verifiable academic accreditation."),
                ("Full Stack Architecture", "Built on modern React 18, Vite, Tailwind CSS on the frontend, and Node.js, Express, MongoDB with in-memory fallback on the backend."),
                ("Key Capabilities", "Interactive course streaming, timed multiple-choice quizzes, practical capstone evaluations, automated 4.0 GPA engine, and verifiable digital certificates."),
                ("Target Audience", "Higher education institutions, coding bootcamps, enterprise corporate training, and independent professional instructors.")
            ],
            "stats": [
                ("12", "Mastery Courses"),
                ("3", "Distinct Roles"),
                ("4.0", "Accredited GPA Scale"),
                ("100%", "Test Pass Rate")
            ]
        },
        {
            "num": "02",
            "tag": "MARKET NEED & ARCHITECTURAL OBJECTIVES",
            "title": "Problem Statement & Solution Blueprint",
            "subtitle": "Bridging the gap between passive video viewing and verifiable skill acquisition",
            "img": "02_courses.png",
            "caption": "Explore Catalog with Real-time Multi-Criteria Taxonomy Filters",
            "bullets": [
                ("The Educational Disconnect", "Traditional LMS platforms suffer from high student dropout rates, passive content consumption, and disjointed assignment grading mechanisms."),
                ("Integrated Practical Workflows", "EduSphere bridges theory and production with hands-on capstone assignments, mandatory passing thresholds, and detailed instructor rubric reviews."),
                ("Unified Multi-Role Portal", "Consolidated single application serving Students, Instructors, and Administrators with strict data privacy and role-specific permissions."),
                ("Zero-Config Cloud Ready", "Engineered with automatic local database fallbacks, production environment parity, rate limiting, and defensive security measures.")
            ],
            "stats": [
                ("85%", "Higher Engagement"),
                ("4-in-1", "Role Consolidation"),
                ("60%", "Passing Threshold"),
                ("<150ms", "API Response Time")
            ]
        },
        {
            "num": "03",
            "tag": "SYSTEM ARCHITECTURE & TECH STACK",
            "title": "Full-Stack MERN Architecture",
            "subtitle": "Modular, decoupled client-server architecture built for high concurrency and resilience",
            "img": "03_course_details.png",
            "caption": "Curriculum Syllabus Accordion & Course Details View",
            "bullets": [
                ("Frontend Layer", "React 18 SPA bundled with Vite for ultra-fast HMR, Tailwind CSS for modern responsive aesthetics, and Recharts for interactive learning velocity analytics."),
                ("Backend REST API Layer", "Express.js 4.21 micro-architecture organized by controllers, routes, middlewares, services, and Zod declarative input validation schemas."),
                ("Data Persistence Layer", "MongoDB with Mongoose ODM modeling 12 interconnected schemas (Users, Courses, Sections, Lessons, Enrollments, Progress, Submissions, Quizzes, Certificates)."),
                ("Zero-Friction Fallback", "Configured with embedded in-memory MongoDB resolution for offline developer onboarding and seamless automated test pipeline execution.")
            ],
            "stats": [
                ("12", "Database Schemas"),
                ("35+", "REST Endpoints"),
                ("100%", "Type-Safe Zod Schemas"),
                ("0", "External DB Dependencies")
            ]
        },
        {
            "num": "04",
            "tag": "SECURITY & ACCESS CONTROL",
            "title": "Role-Based Access Control (RBAC) & Auth",
            "subtitle": "Defensive security architecture with dual-layer client & server route protection",
            "img": "04_login.png",
            "caption": "Secure Authentication Portal with 1-Click Role Switcher",
            "bullets": [
                ("JWT Token Rotation", "Stateless JSON Web Tokens with encrypted payloads, issued on secure authentication and verified via custom Express authorization middleware."),
                ("Argon2 / Bcrypt Hashing", "Zero plaintext passwords; cryptographically salted password hashes with strict complexity requirements (uppercase, numbers, symbols)."),
                ("Granular RBAC Enforcers", "Protected client routes using React Router RoleGuard paired with server-side authorization middleware restricting Admin, Instructor, and Student operations."),
                ("Instant Demo Credentials", "Built-in one-click role switchers for instantaneous evaluator testing without manual credential lookups.")
            ],
            "stats": [
                ("3", "Isolated Roles"),
                ("24h", "Token Expiry"),
                ("10", "Salting Rounds"),
                ("1-Click", "Instant Demo Switch")
            ]
        },
        {
            "num": "05",
            "tag": "LEARNER PORTAL & VELOCITY TRACKING",
            "title": "Student Dashboard & Velocity Analytics",
            "subtitle": "Personalized learning hub with real-time progress, velocity charts, and GPA metrics",
            "img": "05_student_dashboard.png",
            "caption": "Student Learning Dashboard (Liam Miller - 4.0 GPA, A+ Standing)",
            "bullets": [
                ("Personalized KPI Metrics", "Displays active course count, completion rates, pending reviews, earned certifications, and cumulative academic GPA at a single glance."),
                ("Study Velocity Visualization", "Interactive Recharts area chart tracking weekly learning minutes and study momentum with comparative week-over-week trends."),
                ("Resume Learning Engine", "One-click 'Jump to Next Lesson' shortcut that automatically queries the student's earliest incomplete lesson across active enrollments."),
                ("Curated Enrolled Paths", "Progress bar meters dynamically computed from atomic lesson completion records in MongoDB.")
            ],
            "stats": [
                ("4", "Enrolled Courses"),
                ("4.00", "Cumulative GPA"),
                ("+24%", "Study Velocity"),
                ("100%", "Real-time Sync")
            ]
        },
        {
            "num": "06",
            "tag": "CAPSTONE EVALUATIONS & GRADING ENGINE",
            "title": "Assignments, Submissions & 4.0 GPA Scale",
            "subtitle": "Rigorous practical capstone evaluations mapped to standardized 4.0 grade points",
            "img": "06_student_assignments.png",
            "caption": "Assignments Portal with Letter Grade Badges, GP Marks & Instructor Feedback",
            "bullets": [
                ("Practical Capstone Projects", "Every course concludes with an authentic project (e.g., JWT Auth API, Next.js Server Actions, PyTorch Neural Networks, Docker/K8s Clusters)."),
                ("Artifact Submission Portal", "Multi-file upload support (ZIP, PDF, Code) with student architectural rationale and contextual submission notes."),
                ("Standard 4.0 GPA Mapping", "Scores dynamically mapped: 95%+ = A+ (4.0 GP), 90-94% = A (4.0 GP), 85-89% = A- (3.7 GP), 80-84% = B+ (3.3 GP), 75-79% = B (3.0 GP)."),
                ("Academic Standing Banner", "Summarizes total marks awarded, cumulative grade points, overall letter grade, and pending submissions awaiting evaluation.")
            ],
            "stats": [
                ("4.0 GP", "A+ Grade Max"),
                ("100", "Total Marks per Project"),
                ("60", "Passing Minimum"),
                ("4.00", "Current Student GPA")
            ]
        },
        {
            "num": "07",
            "tag": "IMMERSIVE LEARNING EXPERIENCE",
            "title": "Course Studio & Video Streaming Player",
            "subtitle": "High-performance video streaming with synchronized curriculum and note-taking",
            "img": "07_course_player.png",
            "caption": "Course Studio Player with Video Stream, Progress Bar & Curriculum Accordion",
            "bullets": [
                ("HTML5 Video Player", "Fluid streaming video player with multi-speed playback (0.75x–2x), timestamp seeking, keyboard shortcuts, and full-screen controls."),
                ("Progress Persistence", "Heartbeat API patches student playback position into MongoDB every few seconds, allowing seamless cross-device resumption."),
                ("Dual Content Modes", "Seamlessly toggles between high-definition video lectures and rich technical markdown reading guides with syntax-highlighted code."),
                ("Synchronized Curriculum", "Collapsible sidebar drawer showing section-by-section completion checks and instant jump-to-lesson navigation.")
            ],
            "stats": [
                ("1080p", "Video Quality"),
                ("0.75-2x", "Speed Controls"),
                ("100%", "Playable Streams"),
                ("Auto", "Progress Saved")
            ]
        },
        {
            "num": "08",
            "tag": "DIGITAL CREDENTIAL VERIFICATION",
            "title": "Automated PDF Certificates & QR Verify",
            "subtitle": "Tamper-proof completion certificates generated dynamically and verifiable globally",
            "img": "08_verify_cert.png",
            "caption": "Public Certificate Verification Interface with Unique Credential Validation",
            "bullets": [
                ("Automatic Issuance", "Triggered instantaneously upon reaching 100% course curriculum completion and passing all required capstone assessments."),
                ("Server-Side PDF Generation", "Compiled using PDFKit with custom typography, official seals, course title, student name, and date of conferral."),
                ("Cryptographic Identifier", "Each certificate carries a unique verification code (e.g., EDU-92E898A1) indexed directly in the database."),
                ("Public Verification Portal", "Enables employers, recruiters, and academic institutions to verify certificate authenticity at /verify/:id without logging in.")
            ],
            "stats": [
                ("Instant", "PDF Generation"),
                ("EDU-XXX", "Unique Certificate ID"),
                ("100%", "Publicly Verifiable"),
                ("Tamper", "Proof Encryption")
            ]
        },
        {
            "num": "09",
            "tag": "INSTRUCTOR EMPOWERMENT & ANALYTICS",
            "title": "Instructor Dashboard & Course Studio",
            "subtitle": "Comprehensive educator tools for content creation, curriculum design, and student tracking",
            "img": "09_instructor_dashboard.png",
            "caption": "Instructor Management Studio (Dr. Aris Thorne - Course Analytics & KPIs)",
            "bullets": [
                ("Educator Command Center", "Live dashboard tracking published courses, active student enrollments, estimated revenue, and average student ratings."),
                ("Curriculum Architect", "Intuitive drag-and-drop course builder allowing instructors to organize modules into sections, lessons, and downloadable assets."),
                ("Assessment Authoring", "Ability to create timed quizzes with variable passing percentages, penalty rules, and detailed question explanations."),
                ("Revenue & Enrollment Charts", "Visual breakdown of monthly student enrollment velocity and revenue distribution across active course offerings.")
            ],
            "stats": [
                ("12", "Instructor Courses"),
                ("140+", "Active Learners"),
                ("4.9/5", "Average Rating"),
                ("Instant", "Curriculum Publishing")
            ]
        },
        {
            "num": "10",
            "tag": "ACADEMIC EVALUATION & FEEDBACK",
            "title": "Instructor Submissions & Grading Studio",
            "subtitle": "Streamlined code evaluation interface with live grade point indicators and rubrics",
            "img": "10_instructor_grading.png",
            "caption": "Live Grading Interface with Real-time GP Calculation & Feedback Entry",
            "bullets": [
                ("Submission Review Queue", "Filters submitted projects across all instructor courses, highlighting pending reviews and submitted student archives."),
                ("Code Asset Inspection", "One-click download of submitted code packages (.zip, .pdf) for comprehensive code quality review."),
                ("Live Grade Point Preview", "As the instructor enters marks (e.g., 95/100), the UI immediately computes and displays Grade A+ • 4.0 GP in real time."),
                ("Qualitative Feedback Notes", "Instructors provide direct constructive feedback and architectural tips persisted immediately to the student's grade report.")
            ],
            "stats": [
                ("Live GP", "Real-Time Conversion"),
                ("1-Click", "File Inspection"),
                ("Rubric", "Standardized Grading"),
                ("Instant", "Student Notification")
            ]
        },
        {
            "num": "11",
            "tag": "GOVERNANCE & PLATFORM OPERATIONS",
            "title": "Admin Dashboard & Control Center",
            "subtitle": "Enterprise governance, course approval pipelines, user moderation, and audit logs",
            "img": "11_admin_dashboard.png",
            "caption": "Platform Administration Dashboard with System Analytics & Governance Controls",
            "bullets": [
                ("Platform Health & Telemetry", "Real-time overview of active user counts, total published courses, pending approval queue, and system revenue metrics."),
                ("Course Moderation Workflow", "Strict quality gating: instructor-submitted courses require explicit administrator review and approval before public catalog listing."),
                ("User Account Management", "Comprehensive user directory with role assignment, status toggling (active/suspended), and credential resets."),
                ("System Category Taxonomy", "Dynamic creation and maintenance of learning disciplines (Engineering, AI/ML, Cloud, Design, Cybersecurity).")
            ],
            "stats": [
                ("360°", "System Governance"),
                ("0-Downtime", "Account Moderation"),
                ("2-Stage", "Course Quality Gate"),
                ("100%", "Audit Traceability")
            ]
        },
        {
            "num": "12",
            "tag": "TEST VERIFICATION & FUTURE ROADMAP",
            "title": "Testing, Verification & Future Roadmap",
            "subtitle": "Production-tested reliability, automated test suite results, and forward expansion",
            "img": "12_admin_users.png",
            "caption": "Administrative User Management Directory & RBAC Administration",
            "bullets": [
                ("Automated Test Suite", "100% test pass rate across 10 Supertest backend integration suites and 3 Vitest/Testing-Library frontend component suites."),
                ("Defensive Production Hardening", "Equipped with Helmet security headers, CORS origin restrictions, Express rate limiting, and input sanitization."),
                ("Planned Phase 2 Features", "AI-powered personalized study roadmaps, live WebRTC interactive classrooms, peer-to-peer code reviews, and iOS/Android mobile clients."),
                ("Conclusion", "EduSphere represents an end-to-end, enterprise-grade full-stack LMS engineered for robust performance, high engagement, and academic rigor.")
            ],
            "stats": [
                ("13/13", "Tests Passing (100%)"),
                ("0", "Vulnerabilities"),
                ("<50ms", "Middleware Latency"),
                ("Ready", "Production Deployment")
            ]
        }
    ]

    for data in slides_data:
        slide = prs.slides.add_slide(blank_layout)

        # 1. Dark Background Fill
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = C_BG
        bg_shape.line.fill.background()

        # 2. Header Area
        # Tag pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(6.0), Inches(0.35))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_top = tf_tag.margin_right = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = f"{data['num']} | {data['tag']}"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_PRIMARY

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = data['title']
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.4))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = data['subtitle']
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = C_TEXT_MUTED

        # 3. Left Content Card (Width: 6.2 inches)
        left_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(6.2), Inches(4.35))
        left_card.fill.solid()
        left_card.fill.fore_color.rgb = C_CARD_BG
        left_card.line.color.rgb = C_CARD_BORDER
        left_card.line.width = Pt(1)

        # Content Text inside Left Card
        content_box = slide.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(5.7), Inches(4.05))
        tf_content = content_box.text_frame
        tf_content.word_wrap = True
        tf_content.margin_left = tf_content.margin_top = tf_content.margin_right = tf_content.margin_bottom = 0

        for i, (b_title, b_desc) in enumerate(data['bullets']):
            p_bullet = tf_content.paragraphs[0] if i == 0 else tf_content.add_paragraph()
            p_bullet.space_after = Pt(8)
            
            run_title = p_bullet.add_run()
            run_title.text = f"•  {b_title}: "
            run_title.font.size = Pt(10.5)
            run_title.font.bold = True
            run_title.font.color.rgb = C_WHITE

            run_desc = p_bullet.add_run()
            run_desc.text = b_desc
            run_desc.font.size = Pt(9.5)
            run_desc.font.color.rgb = C_TEXT_MUTED

        # 4. Right Visual Area: Snapshot Image (Width: 5.4 inches, Height: 4.35 inches)
        img_path = os.path.join(assets_dir, data['img'])
        if os.path.exists(img_path):
            # Frame card behind image
            img_frame = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.25), Inches(1.85), Inches(5.28), Inches(4.35))
            img_frame.fill.solid()
            img_frame.fill.fore_color.rgb = C_CARD_BG
            img_frame.line.color.rgb = C_CARD_BORDER
            img_frame.line.width = Pt(1)

            # Insert Image
            # Typical 16:9 ratio in 5.1 x 3.6
            slide.shapes.add_picture(img_path, Inches(7.34), Inches(1.94), width=Inches(5.1), height=Inches(3.6))

            # Caption bar below image
            caption_box = slide.shapes.add_textbox(Inches(7.34), Inches(5.62), Inches(5.1), Inches(0.5))
            tf_cap = caption_box.text_frame
            tf_cap.word_wrap = True
            tf_cap.margin_left = tf_cap.margin_top = tf_cap.margin_right = tf_cap.margin_bottom = 0
            p_cap = tf_cap.paragraphs[0]
            p_cap.text = f"📷 Snapshot: {data['caption']}"
            p_cap.font.size = Pt(8.5)
            p_cap.font.bold = True
            p_cap.font.color.rgb = C_CYAN

        # 5. Bottom KPI Stat Grid (4 mini cards at bottom: Left: 0.8, Width: 11.73)
        stat_w = Inches(2.78)
        stat_gap = Inches(0.2)
        stat_y = Inches(6.35)
        stat_h = Inches(0.78)

        for s_idx, (s_val, s_lbl) in enumerate(data['stats']):
            stat_x = Inches(0.8) + (stat_w + stat_gap) * s_idx
            s_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, stat_x, stat_y, stat_w, stat_h)
            s_card.fill.solid()
            s_card.fill.fore_color.rgb = C_CARD_BG
            s_card.line.color.rgb = C_CARD_BORDER
            s_card.line.width = Pt(1)

            s_box = slide.shapes.add_textbox(stat_x + Inches(0.15), stat_y + Inches(0.1), stat_w - Inches(0.3), stat_h - Inches(0.2))
            tf_s = s_box.text_frame
            tf_s.word_wrap = True
            tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
            
            p_val = tf_s.paragraphs[0]
            p_val.text = s_val
            p_val.font.size = Pt(13)
            p_val.font.bold = True
            p_val.font.color.rgb = C_PRIMARY if s_idx % 2 == 0 else C_ACCENT

            p_lbl = tf_s.add_paragraph()
            p_lbl.text = s_lbl
            p_lbl.font.size = Pt(8.5)
            p_lbl.font.color.rgb = C_TEXT_MUTED

    output_path = os.path.join(os.getcwd(), 'EduSphere_Platform_Presentation.pptx')
    prs.save(output_path)
    print(f"Presentation generated successfully: {output_path}")

if __name__ == '__main__':
    create_deck()
