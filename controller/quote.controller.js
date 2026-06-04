const QuoteSchema = require("../schema/quote.schema");
const BookSchema = require("../schema/book.schema");
const CustomErrorHandler = require("../error/error");

const getBookQuotes = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const book = await BookSchema.findById(bookId);
    if (!book) return next(CustomErrorHandler.NotFound("Kitob topilmadi"));

    const quotes = await QuoteSchema.find({ book_id: bookId })
      .populate("added_by", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(quotes);
  } catch (error) {
    next(error);
  }
};

// Iqtibos qo'shish
const addQuote = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { text, page } = req.body;

    const book = await BookSchema.findById(bookId);
    if (!book) return next(CustomErrorHandler.NotFound("Kitob topilmadi"));

    const quote = await QuoteSchema.create({
      text,
      page: page || null,
      book_id: bookId,
      added_by: req.user.id,
    });

    res.status(201).json({ message: "Iqtibos qo'shildi", quote });
  } catch (error) {
    next(error);
  }
};

// update
const updateQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, page } = req.body;

    const quote = await QuoteSchema.findById(id);
    if (!quote) return next(CustomErrorHandler.NotFound("Iqtibos topilmadi"));

    if (
      quote.added_by.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        CustomErrorHandler.Forbidden("Bu amalni bajarishga ruxsat yo'q"),
      );
    }

    await QuoteSchema.updateOne({ _id: id }, { text, page });
    res.status(200).json({ message: "Iqtibos yangilandi" });
  } catch (error) {
    next(error);
  }
};

// delete
const deleteQuote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quote = await QuoteSchema.findById(id);
    if (!quote) return next(CustomErrorHandler.NotFound("Iqtibos topilmadi"));

    if (
      quote.added_by.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        CustomErrorHandler.Forbidden("Bu amalni bajarishga ruxsat yo'q"),
      );
    }

    await QuoteSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Iqtibos o'chirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookQuotes, addQuote, updateQuote, deleteQuote };
