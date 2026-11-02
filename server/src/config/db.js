import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure mongodb-memory-server locates locally cached binaries across working directories
if (!process.env.MONGOMS_SYSTEM_BINARY) {
  const potentialDirs = [
    path.resolve(__dirname, '../../node_modules/.cache/mongodb-memory-server'),
    path.resolve(process.cwd(), 'node_modules/.cache/mongodb-memory-server'),
    path.resolve(process.cwd(), 'server/node_modules/.cache/mongodb-memory-server')
  ];
  for (const dir of potentialDirs) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const binaryFile = files.find(f => f.startsWith('mongod') && (f.endsWith('.exe') || !f.includes('.')));
      if (binaryFile) {
        process.env.MONGOMS_SYSTEM_BINARY = path.join(dir, binaryFile);
        break;
      }
    }
  }
}

let mongodInstance = null;

export const connectDB = async () => {
  const initialUri = config.mongoUri;
  try {
    // Set connection timeout so if local mongod is not running, we don't hang
    const conn = await mongoose.connect(initialUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected to external/local instance: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Primary MongoDB connection failed (${err.message}).`);
    
    // In development or test, fallback to embedded in-memory MongoDB
    if (config.nodeEnv !== 'production') {
      try {
        console.log('[Database] Initializing embedded in-memory MongoDB server for zero-config operation...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memoryUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`[Database] MongoDB Connected to embedded memory instance: ${memoryUri}`);
        return conn;
      } catch (memErr) {
        console.error('[Database] Failed to start embedded in-memory MongoDB:', memErr.message);
        throw memErr;
      }
    } else {
      throw err;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};
