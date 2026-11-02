import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('EduSphere Backend Integration Tests', () => {
  let studentToken = '';
  let adminToken = '';
  let freeCourseId = '';
  let quizId = '';

  it('GET /api/v1/health should return online status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.service).toBe('EduSphere Enterprise API');
  });

  it('POST /api/v1/auth/login should authenticate student and set token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'student.liam@edusphere.io',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('student');
    expect(res.body.accessToken).toBeDefined();
    studentToken = res.body.accessToken;
  });

  it('POST /api/v1/auth/login should authenticate admin', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@edusphere.io',
        password: 'Password123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('admin');
    adminToken = res.body.accessToken;
  });

  it('POST /api/v1/auth/register should prevent public admin registration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Hacker Try',
        email: 'hacker@test.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'admin', // should be forced to student
      });

    // Zod schema only accepts 'student' or 'instructor' in registration
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/courses should list published courses', async () => {
    const res = await request(app).get('/api/v1/courses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.courses.length).toBeGreaterThan(0);

    const freeCourse = res.body.courses.find((c) => c.isFree);
    if (freeCourse) freeCourseId = freeCourse._id;
  });

  it('GET /api/v1/courses/categories should return active categories', async () => {
    const res = await request(app).get('/api/v1/courses/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/admin/dashboard should be forbidden for student', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/dashboard should succeed for admin', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.totalCourses).toBeGreaterThan(0);
  });

  it('GET /api/v1/certificates/my-certificates should return earned certificates for Liam', async () => {
    const res = await request(app)
      .get('/api/v1/certificates/my-certificates')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.certificates.length).toBeGreaterThan(0);

    const cert = res.body.certificates[0];
    expect(cert.certificateId).toMatch(/^EDU-/);

    // Verify public verification endpoint
    const verifyRes = await request(app).get(`/api/v1/certificates/verify/${cert.certificateId}`);
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.isValid).toBe(true);
    expect(verifyRes.body.certificate.studentName).toBe('Liam Miller');
  });
});
