const jwt = require("jsonwebtoken");

// Access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "20m" },
  );
};

// Refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "10d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
