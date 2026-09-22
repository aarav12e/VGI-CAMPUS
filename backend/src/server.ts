import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 VGI CAMPUS API Server running on port ${config.port}`);
  console.log(`📡 Base URL: http://localhost:${config.port}/api/v1`);
  console.log(`🎓 Environment: ${config.nodeEnv}`);
  console.log(`=========================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
