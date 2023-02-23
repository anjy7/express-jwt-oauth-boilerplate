class AppError extends Error {
    constructor(message, statusCode, errorCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      //setting isOperational property to true so that in errorController we can differentiate between the errors
      //caused by invalid inputs by the client and backend errors.So we'll only send the client operational errors
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;