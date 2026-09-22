function sendSuccess(res, data, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}
function sendError(res, code, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}
module.exports = { sendSuccess, sendError };
