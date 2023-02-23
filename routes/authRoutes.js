const express = require("express");
const authController = require("../controllers/auth/authController");
const authRouter = express.Router();

authRouter.route("/signUp").post(authController.basicAuthSignUp);
authRouter.route("/logIn").post(authController.basicAuthLogIn);

authController.route("/forgotPassword",authController.forgotPassword);
// authController.route("")

module.exports = authRouter;