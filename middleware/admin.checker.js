const CustomErrorHandler = require("../error/error");
const jwt = require("jsonwebtoken");

module.exports = function adminChecker(req, res, next) {
  try {
    if (!req.user) {
      throw CustomErrorHandler.unauthorized("Token topilmadi");
    }

    if (req.user.role !== "admin") {
      throw CustomErrorHandler.forbidden(
        "Faqat admin ushbu amalni bajarishi mumkin",
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
