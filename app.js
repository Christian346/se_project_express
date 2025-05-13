const express = require("express"); // import express application
const mongoose = require("mongoose"); // this is the database part to connect it to the database
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { performLogin } = require("./controllers/users");
const errorHandler = require("./middlewares/errorhandler");
const { validateUserLoggin } = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/loggers");
require("dotenv").config(); // allows to read enviromental variables into app


// const routes = require("./routes");

const app = express(); // the app to call the express function
const { PORT = 3001 } = process.env; // makes port into enviromental var

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db") // basic connection string that allows connection with database
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

/*
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
    };
    next();
    });
    // it needed to have a owner and id but the middleware wasnt there yet to test for authentication
    */
app.use(cors());// nothing will be allowed to communicate from the browser to your backend in order to make requests
app.use(express.json());
// app.use(routes);
app.use(requestLogger);
// if request are sent to slash meaning port 3001 then send em to the user router
app.post("/signin", validateUserLoggin, performLogin); // endpoint for allowing a singin post // this should be in the index file because it goes before the user router file! u file instead

app.use("/", mainRouter);
// app.post("/signup", createUser);

app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler

// app use for the error handler
app.use(errorHandler); // all the middleware functions whenever they throw an error will call this middleware error handler
// set up the port and the express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// this project is an API , the api will interact with the database thru controllers and models
// schemas will be in the user model folder
// utils is supporting data that i might need

// postman is an endpoint tester it test routes
