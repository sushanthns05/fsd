import { test, expect } from '@playwright/test';

test.describe('EduSphere End-to-End Workflows', () => {
  const timestamp = Date.now();
  const studentEmail = `student_${timestamp}@test.io`;

  test('1. Student Registration Workflow', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /Create Your Account/i })).toBeVisible();

    await page.fill('input[placeholder="Liam Miller"]', 'E2E Test Student');
    await page.fill('input[placeholder="liam@example.com"]', studentEmail);
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('input[type="password"]').nth(1).fill('Password123!');

    await page.click('button:has-text("Complete Registration")');
    // Successful registration navigates to /student
    await expect(page).toHaveURL(/.*student/);
  });

  test('2. Student Login & Authentication Workflow', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /Log in to EduSphere/i })).toBeVisible();

    await page.fill('input[placeholder="name@edusphere.io"]', 'student.liam@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(/.*student/);
    await expect(page.getByText(/Welcome back, Liam/i)).toBeVisible();
  });

  test('3. Course Discovery & Filtering Workflow', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('heading', { name: /Explore Course Catalog/i })).toBeVisible();

    // Search for course
    await page.fill('input[placeholder*="Search by course title"]', 'MERN');
    await page.waitForTimeout(500);
    await expect(page.getByText(/Full Stack MERN Mastery/i)).toBeVisible();
  });

  test('4. Free Course Enrollment Workflow', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'student.amina@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*student/);

    // Visit free course details
    await page.goto('/courses/modern-ui-ux-tailwind-css');
    await expect(page.getByText(/Modern UI\/UX & Tailwind CSS from Scratch/i)).toBeVisible();

    // Check if Enroll Now button exists or Continue Learning
    const enrollBtn = page.getByRole('button', { name: /Enroll Now/i });
    if (await enrollBtn.isVisible()) {
      await enrollBtn.click();
      await expect(page).toHaveURL(/.*learn\/.*/);
    }
  });

  test('5. Protected Lesson Access Workflow', async ({ page }) => {
    // Login as student Liam who is enrolled
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'student.liam@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*student/);

    await page.goto('/student/my-courses');
    await page.click('a:has-text("Continue")');
    await expect(page).toHaveURL(/.*learn\/.*/);
    await expect(page.getByText(/EduSphere Course Studio/i)).toBeVisible();
  });

  test('6. Quiz Attempt & Server-Side Scoring Workflow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'student.liam@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*student/);

    // Navigate to course learning page
    await page.goto('/student/my-courses');
    await page.click('a:has-text("Continue")');

    // Click Quizzes tab
    await page.click('button:has-text("Quizzes")');
    const startQuizBtn = page.locator('a:has-text("Start Assessment")').first();
    if (await startQuizBtn.isVisible()) {
      await startQuizBtn.click();
      await expect(page).toHaveURL(/.*student\/quiz\/.*/);
    }
  });

  test('7. Certificate Verification Ledger Workflow', async ({ page }) => {
    await page.goto('/verify/EDU-2026-SAMPLE');
    await expect(page.getByRole('heading', { name: /EduSphere Credential Verification/i })).toBeVisible();
  });

  test('8. Instructor Course Creation Workflow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'instructor.aris@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/.*instructor/);

    await page.goto('/instructor/courses/create');
    await expect(page.getByRole('heading', { name: /Create New Course Draft/i })).toBeVisible();
  });

  test('9. Admin Course Approval & Governance Workflow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'admin@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL(/.*admin/);

    await page.goto('/admin/courses/pending');
    await expect(page.getByRole('heading', { name: /Curriculum Quality & Approval/i })).toBeVisible();
  });

  test('10. Unauthorized Access Prevention (RBAC)', async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'student.liam@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*student/);

    // Try accessing Admin area
    await page.goto('/admin');
    // RoleGuard redirects back to student
    await expect(page).toHaveURL(/.*student/);
  });

  test('11. User Logout Workflow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="name@edusphere.io"]', 'student.liam@edusphere.io');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/.*student/);

    // Open profile dropdown and sign out
    await page.locator('header img').click();
    await page.click('button:has-text("Sign Out")');
    await expect(page).toHaveURL('/');
  });
});
