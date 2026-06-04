const { Router } = require("express");
const { register, verify, login } = require("../controller/auth.controller");
const {
  registerValidator,
  loginValidator,
  verifyValidator,
  validate,
} = require("../validator/auth.validator");

const authRouter = Router();

authRouter.post("/auth/register", registerValidator, validate, register);
authRouter.post("/auth/verify", verifyValidator, validate, verify);
authRouter.post("/auth/login", loginValidator, validate, login);

module.exports = authRouter;
