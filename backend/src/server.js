const app = require('./app');
const { config } = require('./config');
const { prisma } = require('./prisma');
const { ensureAcademicDepartments } = require('./modules/academic/academic.bootstrap');

async function startServer() {
  try {
    // Verify connection to Neon PostgreSQL
    await prisma.$connect();

    // Verify all academic departments (B.Tech, B.Pharma, BBA, BCA), HODs, & sections
    await ensureAcademicDepartments();

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