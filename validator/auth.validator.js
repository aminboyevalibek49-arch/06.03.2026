const { body, validationResult } = require("express-validator");
const CustomErrorHandler = require("../error/error");

// Register validatsiya qoidalari
const registerValidator = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username bo'sh bo'lmasin")
    .isLength({ min: 3, max: 30 }).withMessage("Username 3-30 ta belgi oralig'ida bo'lsin")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username faqat harf, raqam va '_' dan iborat bo'lsin"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email bo'sh bo'lmasin")
    .isEmail().withMessage("Email formati noto'g'ri")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Parol bo'sh bo'lmasin")
    .isLength({ min: 6 }).withMessage("Parol kamida 6 ta belgidan iborat bo'lsin")
    .matches(/[A-Z]/).withMessage("Parolda kamida 1 ta katta harf bo'lsin")
    .matches(/[0-9]/).withMessage("Parolda kamida 1 ta raqam bo'lsin"),
];

// Login validatsiya qoidalari
const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email bo'sh bo'lmasin")
    .isEmail().withMessage("Email formati noto'g'ri")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Parol bo'sh bo'lmasin"),
];

// Verify validatsiya qoidalari
const verifyValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email bo'sh bo'lmasin")
    .isEmail().withMessage("Email formati noto'g'ri")
    .normalizeEmail(),

  body("code")
    .trim()
    .notEmpty().withMessage("Tasdiqlash kodi bo'sh bo'lmasin")
    .isLength({ min: 6, max: 6 }).withMessage("Kod 6 ta raqamdan iborat bo'lsin")
    .isNumeric().withMessage("Kod faqat raqamlardan iborat bo'lsin"),
];

// Validatsiya natijalarini tekshirish middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(CustomErrorHandler.BadRequest(messages[0], errors.array()));
  }
  next();
};

module.exports = { registerValidator, loginValidator, verifyValidator, validate };
