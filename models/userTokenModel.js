// const mongoose = require("mongoose");

// const userTokenSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//     },
//     token: {
//       type: String,
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//       expires: 30 * 86400, // 30 days
//     },
//   },
//   { collection: "UserToken" }
// );

// module.exports = mongoose.model("UserToken", userTokenSchema);