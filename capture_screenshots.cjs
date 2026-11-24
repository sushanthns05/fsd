const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const imgDir = path.join(__dirname, 'presentation_assets');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function loginApi(email, password) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ email, password });
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(JSON.parse(body)));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function captureAll() {
  console.log('Authenticating demo accounts via API...');
  const studentAuth = await loginApi('student.liam@edusphere.io', 'Password123!');
  const instructorAuth = await loginApi('instructor.aris@edusphere.io', 'Password123!');
  const adminAuth = await loginApi('admin@edusphere.io', 'Password123!');

  console.log('Student token acquired:', !!studentAuth.accessToken);
  console.log('Instructor token acquired:', !!instructorAuth.accessToken);
  console.log('Admin token acquired:', !!adminAuth.accessToken);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1366, height: 768 },
  });
  const page = await browser.newPage();

  // 1. Landing
  console.log('1. Capturing Landing Page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: path.join(imgDir, '01_landing.png') });

  // 2. Courses
  console.log('2. Capturing Courses Catalog...');
  await page.goto('http://localhost:5173/courses', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: path.join(imgDir, '02_courses.png') });

  // 3. Course Details
  console.log('3. Capturing Course Details...');
  await page.goto('http://localhost:5173/courses/full-stack-mern-mastery', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: path.join(imgDir, '03_course_details.png') });

  // 4. Login Portal
  console.log('4. Capturing Login Page with Roles...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await sleep(600);
  await page.screenshot({ path: path.join(imgDir, '04_login.png') });

  // 5. Student Dashboard
  console.log('5. Capturing Authenticated Student Dashboard (Liam Miller)...');
  await page.evaluate((auth) => {
    localStorage.setItem('edusphere_token', auth.accessToken);
    localStorage.setItem('edusphere_user', JSON.stringify(auth.user));
  }, studentAuth);
  await page.goto('http://localhost:5173/student', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(imgDir, '05_student_dashboard.png') });

  // 6. Student Assignments & GPA
  console.log('6. Capturing Student Assignments & GPA Evaluations...');
  await page.goto('http://localhost:5173/student/assignments', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(imgDir, '06_student_assignments.png') });

  // 7. Course Player
  console.log('7. Capturing Course Studio / Video Player...');
  const learnLink = await page.$('a[href*="/learn/"]');
  if (learnLink) {
    const href = await page.evaluate((el) => el.getAttribute('href'), learnLink);
    await page.goto('http://localhost:5173' + href, { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(imgDir, '07_course_player.png') });
  } else {
    // Navigate directly using student's course ID if any
    const mernCourseId = '6af9d7cace603d7d67e8190a';
    await page.goto(`http://localhost:5173/learn/${mernCourseId}`, { waitUntil: 'networkidle0' });
    await sleep(2000);
    await page.screenshot({ path: path.join(imgDir, '07_course_player.png') });
  }

  // 8. Certificate Verification
  console.log('8. Capturing Certificate Verification...');
  await page.goto('http://localhost:5173/verify', { waitUntil: 'networkidle0' });
  await sleep(800);
  await page.screenshot({ path: path.join(imgDir, '08_verify_cert.png') });

  // 9. Instructor Dashboard
  console.log('9. Capturing Instructor Dashboard (Dr. Aris Thorne)...');
  await page.evaluate((auth) => {
    localStorage.setItem('edusphere_token', auth.accessToken);
    localStorage.setItem('edusphere_user', JSON.stringify(auth.user));
  }, instructorAuth);
  await page.goto('http://localhost:5173/instructor', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(imgDir, '09_instructor_dashboard.png') });

  // 10. Instructor Submissions & Grading
  console.log('10. Capturing Instructor Submissions & Grading Interface...');
  await page.goto('http://localhost:5173/instructor/submissions', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(imgDir, '10_instructor_grading.png') });

  // 11. Admin Dashboard
  console.log('11. Capturing Admin Dashboard...');
  await page.evaluate((auth) => {
    localStorage.setItem('edusphere_token', auth.accessToken);
    localStorage.setItem('edusphere_user', JSON.stringify(auth.user));
  }, adminAuth);
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(imgDir, '11_admin_dashboard.png') });

  // 12. Admin Users
  console.log('12. Capturing Admin User Management...');
  await page.goto('http://localhost:5173/admin/users', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await page.screenshot({ path: path.join(imgDir, '12_admin_users.png') });

  await browser.close();
  console.log('✨ SUCCESS: All 12 authentic, high-resolution snapshots captured!');
}

captureAll().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
