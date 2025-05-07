const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../Errors/BadRequestError");
const ConflictError = require("../Errors/BadRequestError");
const NotFoundError = require("../Errors/NotFoundError");
const IncorrectPassword = require("../Errors/IncorrectPasswordError");


const {
  INVALID,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT_ERROR,
  INCORRECT_PASSWORD,
  //  UserNotFound,
  // INCORRECT_PASSWORD,
} = require("../utils/errors");

// GET /users
/*
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Error with the server" });
    });
};
*/
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body; // whatever the user enters
  // console.log(name, avatar);
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    ) // once the has is generated use it to create the user!
    .then((user) => {
      const userWithoutPassword = { ...user.toObject(), password: undefined };
      return res.status(201).send(userWithoutPassword);
    }) // return what was created to whoever made the request
    .catch((err) => {
      console.error(err);
      // console.log(err.name);

      if (err.name === "ValidationError") {
        // return res
        //   .status(INVALID)
        //   .send({ message: "There has been an invalid request" });
        next(new BadRequestError("There has been an invalid request"));
      }

      if (err.code === 11000) {
        // return res
        //   .status(CONFLICT_ERROR)
        //   .send({ message: `User with ${email} already exists` });
        next(new ConflictError(`User with ${email} already exists`))
      }

      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "There has been an error with the server" });
      next(err);
    });
  // update to read email and password from request body!
  // hash passwords before saving it to database

  // With the uniqueness constraint in place, if an attempt is made to create a user with a duplicate email, MongoDB throws an error with an error code of 11000. Catch this error in the catch block and respond with a 409 conflict error.
};

const getCurrentUser = (req, res, next) => {
  // console loging the req.headers will show you what you have access too useful for troubleshootng
  // const { userId } = req.params; // not from here anymore from the middleware so i have to get it from req.user.id which is added by middleware
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      // console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: "user not found" });
        next(new NotFoundError("user not found"));
      }
      if (err.name === "CastError") {
        // handle cast error
       // return res.status(INVALID).send({ message: "Invalid request" });
       next(new BadRequestError("Invalid request"));
      }

      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "There has been an error with the server" });
      next(err);
    });
};

const performLogin = (req, res, next) => {
  const { email, password } = req.body;

  // if no email or no password, bad
  // request error
  if (!email || !password) {
    // return res
    //   .status(INVALID)
    //   .send({ message: "email or password are required!" });
    next(new BadRequestError("email or password are required!"));
  }

  return (
    User.findUserByCredentials(email, password)
      // .select("+password")
      .then((user) => {
        console.log(user);
        // TODO: import jwt
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        // send back the token
        return res.send({ token , user: {name: user.name, email: user.email, avatar: user.avatar, _id: user._id} });
      })

      .catch((err) => {
        console.error(err);
        // send unauthorized response
        if (err.message === "Incorrect email or password"){
        //  return res
        //    .status(INCORRECT_PASSWORD)
        //    .send({ message: "Unathorized request" });
        next(new IncorrectPassword("Unathorized request"));
        }
        // return res
        // .status(SERVER_ERROR)
        // .send({ message: "There has been an error with the server" });
        next(err);

      })
  );
};

const updateUser = (req, res , next) => {
  const { name, avatar } = req.body;
  // console.log("Updating user", { name, avatar });
  console.log(req.user._id);
 // return User.findById("67be3fc95f2d20ac9c438d8a" /* req.user._id */)
  //  .then((user) => {
  //    console.log({ user });

      return (
        User.findOneAndUpdate(
          { _id:req.user._id  },
          { name, avatar },
          {
            new: true,
            runValidators: true,
          }
        ) // ;
          // })
          .orFail()
          .then((updatedUser) => {
           // console.log({ updatedUser });
            res.status(200).send(updatedUser);
          })
          .catch((err) => {
           console.log(err);
            if (err.name === "DocumentNotFoundError") {
               next(new NotFoundError("id not found "));
              // res.status(NOT_FOUND).send({message:'id not found '});
              // return;
            }
               if (err.name === "ValidationError") {
                //  res.status(INVALID).send({ message: "invalid request" });
                //  return;
                next(new BadRequestError("invalid request"));
               }

            // res.status(SERVER_ERROR).send({ message: "error in the server" });
            next(err)
          })
      );
};

module.exports = {
 // getUsers,
  createUser,
  getCurrentUser,
  performLogin,
  updateUser,
};
