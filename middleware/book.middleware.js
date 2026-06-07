const bookValidator = require("../validator/books.validator");

module.exports = function (req, res, next) {
  const { error } = bookValidator(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details ? error.details[0].message : error.message,
    });
  }
  next();
};
