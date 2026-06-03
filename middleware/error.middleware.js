const CustomErrorHandler = require("../error/error");

module.exports = function errorMiddleware(err, req, res, next) {
  if (err instanceof CustomErrorHandler) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors || [],
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Validation xatosi", errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} allaqachon mavjud`,
    });
  }

  return res.status(500).json({
    message: err.message || "Server xatosi",
  });
};
