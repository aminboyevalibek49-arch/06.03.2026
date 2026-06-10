const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/error");

module.exports = function adminChecker(req, res, next) {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw CustomErrorHandler.BadRequest("No token provided");
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;

    if (req.user.role !== "admin") {
      throw CustomErrorHandler.Forbidden("You are not admin");
    }

    next();
  } catch (error) {
    next(error);
  }
};
