const { sendError } = require('../utils/response');

/**
 * 404 Not Found Middleware
 */
function notFoundHandler(req, res, next) {
  return sendError(res, 'NOT_FOUND', `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
}

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Prisma unique constraint violation (P2002)
  if (err.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    return sendError(res, 'CONFLICT', `A record with this ${target} already exists.`, 409);
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return sendError(res, 'NOT_FOUND', err.meta?.cause || 'Requested record was not found.', 404);
  }

  // Prisma invalid relation or foreign key constraint violation (P2003)
  if (err.code === 'P2003') {
    return sendError(res, 'INVALID_RELATION', 'Foreign key constraint failed on the database.', 400);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An internal server error occurred';
  const code = err.code || 'SERVER_ERROR';

  return sendError(res, code, message, statusCode);
}

module.exports = { notFoundHandler, errorHandler };
