const mongoose = require("mongoose");
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    loginType: {
      type: Number, //0 for google login 1 for basic login
      required: true,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    passwordChangedAt:{
      type : String,
    },
    passwordResetToken:{
      type : String,
    },
    passwordResetTokenExpires:{
      type : Date,
    },
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },

    userRole: {
      type: Number,//MEMBER: 1,ADMIN: 2,UNVERIFIED: 0
    },
    // userRole: {
    //   type: String,
    //   default:'unverified',
    // },
    // userRole: {
    //   type: String,
    //   enum: ['user','admin','unverified'],
    //   default:'not-verified'
    // },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  //collection should be stored in a collection named "Users"
  { collection: "Users" }
);

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // used to change format of time stamp
    return JWTTimestamp < changeTimestamp;
  }
  return false;
}

exports.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); //creating random reset token

  this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex'); // encrypting the reset token 

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // expires in 10mins

  // returning reset token as it will be sent to the user via email
  return resetToken;
}

module.exports = mongoose.model("Users", userSchema);