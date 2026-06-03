const BookSchema = require("../schema/book.schema");
const CustomErrorHandler = require("../error/error");

const getAllBooks = async (req, res, next) => {
  try {
    const books = await BookSchema.find().populate("author_info", "-_id -createdAt -updatedAt");
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { searchingvalue } = req.query;
    const books = await BookSchema.find({
      title: { $regex: searchingvalue, $options: "i" },
    }).populate("author_info", "-_id -createdAt -updatedAt");
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

const addBook = async (req, res, next) => {
  try {
    const { title, period, pages, published_year, genres, publisher, details, author_info } = req.body;

    const cover = req.file ? req.file.filename : null;

    await BookSchema.create({
      title, period, pages, published_year, genres, publisher, details, author_info, cover,
    });

    res.status(201).json({ message: "Kitob qo'shildi" });
  } catch (error) {
    next(error);
  }
};

const getOneBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await BookSchema.findById(id).populate("author_info", "-_id -createdAt -updatedAt");

    if (!book) return next(CustomErrorHandler.NotFound("Kitob topilmadi"));

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, period, pages, published_year, genres, publisher, details, author_info } = req.body;

    const book = await BookSchema.findById(id);
    if (!book) return next(CustomErrorHandler.NotFound("Kitob topilmadi"));

    const cover = req.file ? req.file.filename : book.cover;

    await BookSchema.updateOne(
      { _id: id },
      { title, period, pages, published_year, genres, publisher, details, author_info, cover }
    );

    res.status(200).json({ message: "Kitob yangilandi" });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await BookSchema.findById(id);

    if (!book) return next(CustomErrorHandler.NotFound("Kitob topilmadi"));

    await BookSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Kitob o'chirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, getOneBook, addBook, updateBook, deleteBook, search };
