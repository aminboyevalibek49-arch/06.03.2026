const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../schema/user.schema");
const AuthorSchema = require("../schema/author.schema");
const CustomErrorHandler = require("../error/error");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15d" },
  );
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(
        CustomErrorHandler.BadRequest("username, email va password majburiy"),
      );
    }

    const existingUser = await UserSchema.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return next(
        CustomErrorHandler.BadRequest("Email yoki username allaqachon mavjud"),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserSchema.create({
      username,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Muvaffaqiyatli ro'yxatdan o'tildi",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(CustomErrorHandler.BadRequest("Email va password majburiy"));
    }

    const user = await UserSchema.findOne({ email });
    if (!user)
      return next(
        CustomErrorHandler.Unauthorized("Email yoki parol noto'g'ri"),
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(
        CustomErrorHandler.Unauthorized("Email yoki parol noto'g'ri"),
      );

    const token = generateToken(user);

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

const getProfile = async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password");
    if (!user)
      return next(CustomErrorHandler.NotFound("Foydalanuvchi topilmadi"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await AuthorSchema.find();
    res.status(200).json(authors);
  } catch (error) {
    next(error);
  }
};

const getOneAuthor = async (req, res, next) => {
  try {
    const author = await AuthorSchema.findById(req.params.id);
    if (!author) return next(CustomErrorHandler.NotFound("Muallif topilmadi"));
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
};

const addAuthor = async (req, res, next) => {
  try {
    const { full_name, birth_year, death_year, bio, period, work, region } =
      req.body;
    const photo = req.file ? req.file.filename : null;

    if (!req.file) {
      throw CustomErrorHandler.BadRequest("Rasm yuklanishi kerak");
    }
    await AuthorSchema.create({
      full_name,
      birth_year,
      death_year,
      bio,
      period,
      work,
      region,
      photo,
      picture: "http://localhost:3000/images/" + req.file.filename,
    });
    res.status(201).json({ message: "Muallif qo'shildi" });
  } catch (error) {
    next(error);
  }
};

const updateAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, birth_year, death_year, bio, period, work, region } =
      req.body;

    const author = await AuthorSchema.findById(id);
    if (!author) return next(CustomErrorHandler.NotFound("Muallif topilmadi"));

    const photo = req.file ? req.file.filename : author.photo;

    await AuthorSchema.updateOne(
      { _id: id },
      { full_name, birth_year, death_year, bio, period, work, region, photo },
    );
    res.status(200).json({ message: "Muallif yangilandi" });
  } catch (error) {
    next(error);
  }
};

const deleteAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const author = await AuthorSchema.findById(id);
    if (!author) return next(CustomErrorHandler.NotFound("Muallif topilmadi"));

    await AuthorSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Muallif o'chirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getAllAuthors,
  getOneAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
};
