const app = require('./app');
const { config } = require('./config');
const { prisma } = require('./prisma');

async function startServer() {
  try {
    // Verify connection to Neon PostgreSQL
    await prisma.$connect();

    const server = app.listen(config.port, () => {
      console.log(`=========================================`);
      console.log(`🚀 VGI CAMPUS API Server running on port ${config.port}`);
      console.log(`📡 Base URL: http://localhost:${config.port}/api/v1`);
      console.log(`✅ Database: Connected successfully to Neon DB (PostgreSQL)`);
      console.log(`🎓 Environment: ${config.nodeEnv}`);
      console.log(`=========================================`);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      await prisma.$disconnect();
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

startServer();