const mongoose = require("mongoose");
const app = require("./app");


//{NOT GOOD PRACTISE}
//Handling uncaughtException caused by not catching synchronus code errors

// process.on('uncaughtException' , err => {
//     console.log(err.name,err.message);
//     console.log('UNCAUGHT EXCEPTION! Shutting down...')
//     process.exit(1);
// })

// require("dotenv").config();

const path = require("path");
const { Server } = require("http");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
// console.log(path.resolve(__dirname, "./.env"));

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, maxPoolSize: 100, minPoolSize: 2 },
  () => {
    console.log("Connected to DataBase");
  }
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server Up and Running on port ${PORT}...`));

//{NOT GOOD PRACTISE}
//handling unhandeled promise rejection when there's problem with db or basically any time where promise is rejected
//and error is not handeled in async code


// const server = app.listen(PORT, () => console.log(`Server Up and Running on port ${PORT}...`));

//Here we use a event listener which on listening for unhandledRejection executes the function below

// process.on('unhandledRejection' , err => {
//     console.log(err.name,err.message);
//     console.log('UNHANDLED REJECTION! Shutting down...')
//     server.close(() => {
//         process.exit(1);
//     }) 
// })

