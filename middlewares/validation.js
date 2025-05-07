const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

/*
1. The clothing item body when an item is created

The item name is a required string of between 2 and 30 characters.
An image URL is a required string in a URL format.
2. The user info body when a user is created

The user name is a string of between 2 and 30 characters.
The user avatar is a required string in a URL format.
Email is a required string in a valid email format.
Password is a required string.
3. Authentication when a user logs in

Email is a required string in a valid email format.
Password is a required string.
4. User and clothing item IDs when they are accessed

IDs must be a hexadecimal value length of 24 characters.

*/
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    weather: Joi.string().valid("warm","hot","cold").required(),
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

// req.params = {itemId: 12e12e12e12de}
const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateUserCreation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateUserLoggin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
})

module.exports = {validateClothingItem, validateId , validateUserLoggin, validateUserCreation};

