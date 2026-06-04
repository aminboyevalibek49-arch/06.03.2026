const { Router } = require("express");
const {
  getBookQuotes,
  addQuote,
  updateQuote,
  deleteQuote,
} = require("../controller/quote.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { body } = require("express-validator");
const { validate } = require("../validator/auth.validator");

const quoteRouter = Router();

quoteRouter.get("/books/:bookId/quotes", getBookQuotes);

quoteRouter.post(
  "/books/:bookId/quotes",
  authMiddleware,
  [
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Iqtibos matni bo'sh bo'lmasin")
      .isLength({ min: 5, max: 500 })
      .withMessage("Iqtibos 5-500 ta belgi oralig'ida bo'lsin"),
    body("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Sahifa raqami musbat son bo'lsin"),
  ],
  validate,
  addQuote,
);

quoteRouter.put(
  "/quotes/:id",
  authMiddleware,
  [
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Iqtibos matni bo'sh bo'lmasin")
      .isLength({ min: 5, max: 500 })
      .withMessage("Iqtibos 5-500 ta belgi oralig'ida bo'lsin"),
    body("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Sahifa raqami musbat son bo'lsin"),
  ],
  validate,
  updateQuote,
);

quoteRouter.delete("/quotes/:id", authMiddleware, deleteQuote);

module.exports = quoteRouter;
