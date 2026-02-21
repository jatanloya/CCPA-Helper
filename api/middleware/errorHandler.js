function errorHandler(err, _req, res, _next) {
  console.error(err.stack || err.message);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, error: "Validation failed", details: messages });
  }

  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, error: `Invalid value for ${err.path}` });
  }

  if (err.name === "ZodError") {
    return res
      .status(400)
      .json({ success: false, error: "Invalid input", details: err.issues });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res
      .status(409)
      .json({ success: false, error: `Duplicate value for ${field}` });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "Internal server error";
  res.status(statusCode).json({ success: false, error: message });
}

module.exports = errorHandler;
