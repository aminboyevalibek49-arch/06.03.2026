const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/**
 * Email yuborish
 * @param {string} to - Qabul qiluvchi email
 * @param {string} subject - Mavzu
 * @param {string} html - HTML kontent
 */
const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Kitoblar API" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
