function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json({ success: true, data });
}

function sendError(res, message, statusCode = 500) {
  res.status(statusCode).json({ success: false, error: message });
}

module.exports = { sendSuccess, sendError };
