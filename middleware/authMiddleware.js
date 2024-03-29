const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { errorCodes } = require("../utils/constants");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require('util');

exports.auth = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE AND PASS CURRENTUSER TO THE NEXT MIDDLEWARE
  req.user = currentUser;
  next();
});


exports.restrictTo = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.userRole)){
      return next(
        new AppError("You don't have the permission to perform this action",403)
      );
    }
    next();
  };
}


