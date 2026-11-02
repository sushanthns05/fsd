import { beforeAll, afterAll } from 'vitest';
import { connectDB, closeDB } from '../src/config/db.js';
import { seedDatabase } from '../src/utils/seed.js';

beforeAll(async () => {
  await connectDB();
  await seedDatabase();
}, 300000);

afterAll(async () => {
  await closeDB();
}, 30000);
