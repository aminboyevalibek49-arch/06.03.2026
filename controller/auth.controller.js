const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../schema/user.schema");
const CustomErrorHandler = require("../error/error");
const sendEmail = require("../utils/sendEmail");

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserSchema.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return next(
          CustomErrorHandler.BadRequest(
            "Bu email allaqachon ro'yxatdan o'tgan",
          ),
        );
      }
      return next(CustomErrorHandler.BadRequest("Bu username band"));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verifyCode = generateCode();
    const verifyCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 daqiqa

    // akkaunt yaratish
    await UserSchema.create({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpires,
    });

    // Emailga kod yuborish
    await sendEmail(
      email,
      "Email tasdiqlash kodi",
      `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">Xush kelibsiz, ${username}!</h2>
          <p>Hisobingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${verifyCode}</span>
          </div>
          <p style="color: #888; font-size: 13px;">Kod 10 daqiqa ichida amal qiladi.</p>
          <p style="color: #888; font-size: 13px;">Agar siz ro'yxatdan o'tmagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.</p>
        </div>
      `,
    );

    res.status(201).json({
      message: `${email} manziliga tasdiqlash kodi yuborildi`,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await UserSchema.findOne({ email });

    if (!user) {
      return next(CustomErrorHandler.NotFound("Foydalanuvchi topilmadi"));
    }

    if (user.isVerified) {
      return next(
        CustomErrorHandler.BadRequest("Hisob allaqachon tasdiqlangan"),
      );
    }

    if (user.verifyCode !== code) {
      return next(CustomErrorHandler.BadRequest("Tasdiqlash kodi noto'g'ri"));
    }

    if (user.verifyCodeExpires < new Date()) {
      return next(
        CustomErrorHandler.BadRequest("Tasdiqlash kodining muddati tugagan"),
      );
    }

    // Hisobni tasdiqlash
    await UserSchema.updateOne(
      { email },
      {
        isVerified: true,
        verifyCode: null,
        verifyCodeExpires: null,
      },
    );

    res.status(200).json({ message: "Hisob muvaffaqiyatli tasdiqlandi" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserSchema.findOne({ email });

    if (!user) {
      return next(CustomErrorHandler.BadRequest("Email yoki parol noto'g'ri"));
    }

    if (!user.isVerified) {
      return next(
        CustomErrorHandler.Forbidden("Avval emailingizni tasdiqlang"),
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(CustomErrorHandler.BadRequest("Email yoki parol noto'g'ri"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.status(200).json({
      message: "Muvaffaqiyatli kirildi",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verify, login };
