const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadPath = path.join(__dirname, "..", "uploads", "images");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const UniqueFilename = Math.random() * 1000 + "_" + Date.now() + ext;

    cb(null, UniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image.webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("allowed types are required (png, jpg, webp) "));
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});
