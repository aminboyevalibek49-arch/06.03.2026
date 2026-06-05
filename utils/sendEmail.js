const nodemailer = require("nodemailer");
const CustomErrorHandler = require("../error/error");

async function sendEmail(email, code) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aminboyevalibek077@gmail.com",
        pass: process.env.GOOGLE_PASS,
      },
    });

    await transporter.sendMail({
      subject: "DevBook",
      text: "lorem ipsum",
      from: "aminboyevalibek077@gmail.com",
      to: email,
      html: `<b style="color: blue; font-size : 36px ">${code}</b>`,
    });
  } catch (err) {
    throw CustomErrorHandler.BadRequest("error.message");
  }
}

module.exports = sendEmail;
