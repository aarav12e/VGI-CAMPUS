const dotenv = require('dotenv');
dotenv.config();
const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'vgi-campus-secret-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
module.exports = { config };
