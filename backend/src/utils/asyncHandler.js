/**
 * Async handler to wrap async route controllers and forward unhandled rejections to Next()
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { asyncHandler };
