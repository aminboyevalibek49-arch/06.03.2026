const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../error/error");

module.exports = function authorization(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw CustomErrorHandler.badRequest("Token topilmadi");
    }

    const parts = token.split(" ");
    const bearer = parts[0];
    const partOfToken = parts[1];

    if (bearer !== "Bearer" || !partOfToken) {
      throw CustomErrorHandler.badRequest("Bearer token noto'g'ri formatda");
    }

    const decode = jwt.verify(partOfToken, process.env.JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    next(error);
  }
};
