const CustomErrorHandler = require("../error/error");
const authorValidator = require("../validator/auth.validator");

module.exports = function (req, res, next) {
  const { error } = authorValidator(req.body);

  if (error) {
    throw CustomErrorHandler.badRequest(error);
  }

  next();
};
