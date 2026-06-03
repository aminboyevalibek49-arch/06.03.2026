const { Schema, model } = require("mongoose");

const Book = new Schema(
  {
    title: {
      type: String, required: true,
      set: (val) => val.trim(),
      minLength: [3, "Kamida 3 ta harf bolsin"],
      maxLength: 150,
    },
    period: {
      type: String, required: true,
      enum: {
        values: ["Temuriylar davri", "Jadid davri", "Sovet davri", "Mustaqillik davri"],
        message: "{VALUE} bunday qiymat ko'rsatilmagan",
      },
      default: "Temuriylar davri",
    },
    pages: { type: Number, required: true, min: 0, max: 10000 },
    published_year: { type: Number, required: true },
    genres: {
      type: String, required: true,
      enum: {
        values: ["Fantastik", "Badiy", "Drama", "meladrama", "tarixiy", "diniy", "romantik", "roman"],
        message: "{VALUE} bunday qiymat ko'rsatilmagan",
      },
    },
    publisher: { type: String, required: true },
    details: { type: String, required: true },
    author_info: { type: Schema.Types.ObjectId, required: true, ref: "Author" },
    cover: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Book", Book);
