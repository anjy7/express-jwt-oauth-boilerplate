const express = require('express')
const cors = require('cors')
const errorController = require('./controllers/errorController')
const { errorCodes } = require('./utils/constants')
const AppError = require('./utils/appError')
const morgan = require('morgan')
const limiter = require('express-rate-limiter')

const app = express()
// app.use(require("express-status-monitor")());

app.use(express.json())

// app.use(
//   limiter({
//     windowMs: 1 * 60 * 1000, //100 per min requests allowed from one IP address
//     max: 100,
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//     message: {
//       code: 429,
//       message: "Too many requests made, please try again later",
//     },
//   })
// );

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  )

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', '*')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

morgan.token('req-headers', function (req, res) {
  return JSON.stringify(req.headers)
})

process.env.NODE_ENV != 'production' &&
  app.use(morgan(':method :url :status :req-headers'))


//routes
app.use("/api/auth",require("./routes/authRoutes"))
app.use("/api/admin",require("./routes/adminRoutes"))



//all invalid urls handled here
app.all("*", (req, res, next) => {
    //express will assume whatever we pass into next as error and it will skip all the middlewares in the stack and go to the error middleware
    next(
      new AppError(
        `Can't find ${req.originalUrl} on this server`,
        404,
        errorCodes.INVALID_URL
      )
    );
  });
  
app.use(errorController);
  
module.exports = app;