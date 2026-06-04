const { Schema, model } = require("mongoose");

const Quote = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "Iqtibos kamida 5 ta belgidan iborat bo'lsin"],
      maxLength: [500, "Iqtibos 500 ta belgidan oshmasin"],
    },
    page: {
      type: Number,
      default: null,
    },
    book_id: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    added_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("Quote", Quote);
