const Users = require("../../models/userModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

//get all users
exports.getUsers = catchAsync(async (req,res,next) => {
    const allUsers = await Users.find();
    res.status(200).json({
        status: 'success',
        results: allUsers.length,
        data: {
            allUsers
        }
      });
})