const { Schema, model } = require("mongoose");

const Author = new Schema(
  {
    full_name: { type: String, required: true },
    birth_year: { type: Date, required: true },
    death_year: { type: String, required: true },
    bio: { type: String, required: true },
    period: {
      type: String,
      required: true,
      enum: {
        values: ["Temuriylar davri", "Jadid davri", "Sovet davri", "Mustaqillik davri"],
        message: "{VALUE} bunday qiymat ko'rsatilmagan",
      },
    },
    work: { type: String, required: true },
    region: { type: String, required: true },
    photo: { type: String, default: null },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Author", Author);
