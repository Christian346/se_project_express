const User = require("../models/user");
const { INVALID, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
  .then((users)=> {res.status(200).send(users)})
  .catch((err)=>{
    console.error(err)
    return res.status(SERVER_ERROR).send({message: "Error with the server"});
  });
};

const createUser= (req, res)=>{
  const {name, avatar} = req.body;
  // console.log(name, avatar);
  User.create({name , avatar})
  .then((user)=> res.status(201).send(user))
  .catch((err) => {

   console.error(err);
   // console.log(err.name);

   if(err.name === "ValidationError"){
      return res.status(INVALID).send({ message:"There has been an invalid request" });
   }
    return res.status(SERVER_ERROR).send({ message: "There has been an error with the server" });
  })
};

const getUser = (req, res)=>{
const { userId } = req.params;
User.findById(userId)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.error(err);
    // console.log(err.name);
    if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "user not found" });
    }
    if (err.name === "CastError") {
      // handle cast error
      return res.status(INVALID).send({ message: "Invalid request" });
    }

    return res.status(SERVER_ERROR).send({ message: "There has been an error with the server" });
  });
};


module.exports = { getUsers , createUser , getUser};

// todo in separate file export const BAD_REQUEST_STATUS_CODE = 400 then import and use in here!