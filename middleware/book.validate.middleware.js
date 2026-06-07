const CustomErrorHandler = require("../error/error");
const bookValidator = require("../validator/books.validator");

module.exports = function (req, res, next) {
  const { error } = bookValidator(req.body);

  if (error) {
    return next(CustomErrorHandler.badRequest(error.details[0].message));
  }

  next();
};
