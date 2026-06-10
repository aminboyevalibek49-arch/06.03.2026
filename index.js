require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.config");
const authorRouter = require("./router/author.routes");
const bookRouter = require("./router/book.routes");
const errorMiddleware = require("./middleware/error.middleware");
const cookieParser = require("cookie-parser");
const CitationRouter = require("./router/citation.routes");
const logger = require("./utils/logger");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("uploads", express.static(path.join(__dirname, "uploads/images")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use(authorRouter);
app.use(bookRouter);
app.use(CitationRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is running at: " + PORT);
});
