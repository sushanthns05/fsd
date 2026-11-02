import app from './src/app.js';
import { connectDB, closeDB } from './src/config/db.js';
import { config } from './src/config/environment.js';
import { User } from './src/models/User.js';
import { seedDatabase } from './src/utils/seed.js';

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed demo data in development if database is empty
    if (config.nodeEnv !== 'production') {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[EduSphere] Empty database detected. Auto-seeding comprehensive demo data...');
        await seedDatabase();
      }
    }

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚀 EduSphere Server running on port ${config.port}`);
      console.log(`🌐 Environment: ${config.nodeEnv}`);
      console.log(`📡 Health: http://localhost:${config.port}/api/v1/health`);
      console.log(`====================================================`);
    });

    const shutdown = async () => {
      console.log('Shutting down EduSphere server gracefully...');
      server.close(async () => {
        await closeDB();
        console.log('Server and database connections terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
