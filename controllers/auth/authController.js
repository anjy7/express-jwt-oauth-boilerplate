const User = require("../../models/userModel");
// const UserToken = require("../../models/userTokenModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { errorCodes, loginType } = require("../../utils/constants");
// const { generateTokens, verifyRefreshToken } = require("./utils");
const {
  signUpBodyValidation,
  logInBodyValidation,
} = require("./validationSchema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signToken = id => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//SignUp
exports.basicAuthSignUp = catchAsync(async (req, res, next) => {
  const { error } = signUpBodyValidation(req.body);
  if (error) {
    return next(
      new AppError(
        error.details[0].message,
        400,
        errorCodes.INPUT_PARAMS_INVALID
      )
    );
  }

  //checking username
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    return next(
      new AppError("Username already exists", 412, errorCodes.USER_NAME_EXIXTS)
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  await new User({
    loginType: loginType.BASIC_LOGIN,
    username: req.body.username,
    password: hashPassword,
    email: req.body.email,
    firstName: null,
    lastName: null,
    userRole: null,
  }).save();

  const savedUser = await User.findOne({ username: req.body.username });
  // const { accessToken, refreshToken } = await generateTokens(savedUser);
  const accessToken = await signToken(savedUser._id);
  res.status(201).json({
    message: "Account created sucessfully",
    accessToken,
    // refreshToken,
  });
});

//Login
exports.basicAuthLogIn = catchAsync(async (req, res, next) => {
  const { error } = logInBodyValidation(req.body);
  if (error) {
    return next(
      new AppError(
        error.details[0].message,
        400,
        errorCodes.INPUT_PARAMS_INVALID
      )
    );
  }

  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return next(
      new AppError(
        "Invalid username or password",
        401,
        errorCodes.INVALID_USERNAME_OR_PASSWORD
      )
    );
  }

  const verifiedPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!verifiedPassword) {
    return next(
      new AppError(
        "Invalid username or password",
        401,
        errorCodes.INVALID_USERNAME_OR_PASSWORD
      )
    );
  }

  const accessToken = await signToken(user._id);

  res.status(200).json({
    message: "Logged in sucessfully",
    accessToken,
    data: {
      id : user._id, 
      userRole : user.userRole
    }
    // refreshToken,
  });
});

//forgot password
exports.forgotPassword = catchAsync(async (res,req,next) => {
  // Get user based on POSTed email
  const user = await User.findOne({email:req.body.email});
  if(!user){
    return next(new AppError('There is no user with email address'),404)
  }
  //Generate the random Reset Token
  const resetToken = user.createPasswordResetToken();
  //here we save the user as we want to store the encrypted reset token in the db
  await user.save({ validateBeforeSave: false });
  // deactivates all the validators in the schema otherwise it will ask for
  // all the required fields whenever saving the user
})


// exports.getNewAccessToken = catchAsync(async (req, res, next) => {
//   const { error } = refreshTokenBodyValidation(req.body);
//   if (error) {
//     return next(
//       new AppError(
//         error.details[0].message,
//         400,
//         errorCodes.INPUT_PARAMS_INVALID
//       )
//     );
//   }

//   verifyRefreshToken(req.body.refreshToken)
//     .then(({ tokenDetails }) => {
//       const payload = {
//         _id: tokenDetails._id,
//       };

//       const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: "15m",
//       });

//       res.status(200).json({
//         message: "Access token created successfully",
//         accessToken,
//       });
//     })
//     .catch((err) => {
//       return new AppError(
//         "Please SignOut and SignIn Again",
//         401,
//         errorCodes.INVALID_TOKEN
//       );
//     });
// });

// exports.logout = catchAsync(async (req, res, next) => {
//   const { error } = refreshTokenBodyValidation(req.body);
//   if (error) {
//     return next(
//       new AppError(
//         error.details[0].message,
//         400,
//         errorCodes.INPUT_PARAMS_INVALID
//       )
//     );
//   }

//   const userToken = await UserToken.findOne({ token: req.body.refreshToken });
//   if (!userToken) {
//     return new AppError(
//       "Please SignOut and SignIn Again",
//       401,
//       errorCodes.INVALID_TOKEN
//     );
//   }
//   await userToken.remove();
//   res.status(200).json({ message: "Logged Out Sucessfully" });
// });