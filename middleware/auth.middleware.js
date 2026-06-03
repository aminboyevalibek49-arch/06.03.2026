const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/error");

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(CustomErrorHandler.Unauthorized("Token mavjud emas"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(CustomErrorHandler.Unauthorized("Token muddati tugagan"));
    }
    return next(CustomErrorHandler.Unauthorized("Token noto'g'ri"));
  }
};
