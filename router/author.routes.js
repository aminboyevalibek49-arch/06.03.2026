const { Router } = require("express");
const {
  register,
  login,
  getProfile,
  getAllAuthors,
  getOneAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controller/author.controller");
const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const authorRouter = Router();

authorRouter.post("/auth/register", register);
authorRouter.post("/auth/login", login);
authorRouter.get("/auth/profile", authMiddleware, getProfile);
authorRouter.get("/get_all_authors", getAllAuthors);
authorRouter.get("/get_one_author/:id", getOneAuthor);
authorRouter.post(
  "/add_author",
  authMiddleware,
  upload.single("photo"),
  addAuthor,
);
authorRouter.put(
  "/update_author/:id",
  authMiddleware,
  upload.single("photo"),
  updateAuthor,
);
authorRouter.post("/add_author",authMiddleware,upload.single("photo"),addAuthor,);
authorRouter.put("/update_author/:id",authMiddleware,upload.single("photo"),updateAuthor,);
authorRouter.delete("/delete_author/:id", authMiddleware, deleteAuthor);

module.exports = authorRouter;