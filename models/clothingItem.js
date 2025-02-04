const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength:30
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // this data type for underscor id  unquire id assigned to each item in database
    required: true,
    ref: User, // user is the user model they're interconnected
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:User
      },
    ],
    default:[]
  },
  createdAt : {
    type: Date,
    default: Date.now //  with don't use parenthesis it was going to use the date when the item was created!
  }
});

// model are used by controllers !

module.exports = mongoose.model("clothingItems", clothingItemSchema);
