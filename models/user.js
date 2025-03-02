const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    // validate using validator package!
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email",
    },
    // email field must be unique
    unique: true, // there can't 2 of the same email.
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // to avoid sending password back to the client its bad for security reasons
  },
});

// we're adding the findUserByCredentials methods to the User schema
// it will have two parameters, email and password
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log({ user, email, password });
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user; // now user is available
      });
    });
};

module.exports = mongoose.model("user", userSchema);
