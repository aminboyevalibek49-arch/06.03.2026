const { Router } = require("express");
const {
  getAllBooks,
  getOneBook,
  search,
  addBook,
  updateBook,
  deleteBook,
} = require("../controller/book.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const bookRouter = Router();

// Ochiq yo'llar
bookRouter.get("/get_all_books", getAllBooks);
bookRouter.get("/get_one_book/:id", getOneBook);
bookRouter.get("/search", search);

// Himoyalangan yo'llar (token + optional fayl yuklash)
bookRouter.post("/add_book", authMiddleware, upload.single("cover"), addBook);
bookRouter.put("/update_book/:id", authMiddleware, upload.single("cover"), updateBook);
bookRouter.delete("/delete_book/:id", authMiddleware, deleteBook);

module.exports = bookRouter;
