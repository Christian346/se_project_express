const express = require("express"); // import express application
const mongoose = require("mongoose"); // this is the database part to connect it to the database
const cors = require("cors");
const mainRouter = require("./routes/index");
const { performLogin } = require("./controllers/users");


// const routes = require("./routes");

const app = express(); // the app to call the express function
const { PORT = 3001 } = process.env;

app.use(cors());

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
app.use(express.json());
// app.use(routes);

// if request are sent to slash meaning port 3001 then send em to the user router
app.post("/signin", performLogin);

app.use("/", mainRouter);
// app.post("/signup", createUser);



// set up the port and the express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// this project is an API , the api will interact with the database thru controllers and models
// schemas will be in the user model folder
// utils is supporting data that i might need

// postman is an endpoint tester it test routes
