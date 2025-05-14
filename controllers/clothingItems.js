const ClothingItem = require("../models/clothingItem");
const { INVALID, NOT_FOUND, SERVER_ERROR,FORBIDDEN } = require("../utils/errors");
const BadRequestError = require("../Errors/BadRequestError");
const ForbiddenError = require("../Errors/ForbiddenError");
const NotFound = require("../Errors/NotFoundError");



// main handler of api calls
// we will be using next parameter in order to move the next middleware
const createItem = (req, res , next) => {

  console.log(req);
  console.log(req.body);

  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;
  // name:name,weather:weather,imageURL:imageURL
  ClothingItem.create({ name, weather, imageUrl, owner: userId }) // saves it as the owner
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      // catch validation error with an if block
      if (e.name === "ValidationError") {
        next(new BadRequestError("Validation Error occured" ))
      //   return res
      //     .status(INVALID)
      //     .send({ message: "Validation Error occured" });
       }


  // return res .status(SERVER_ERROR).send({ message: "Error from the createItem"});
  next(e)
    });
};

const getItems = (req, res , next) => {
  ClothingItem.find({})

    .then((items) => res.status(200).send(items))
    .catch((e) => {
      next(e) // for the 500's let next handle using hte errorhandler middleware
    });
};

/*

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(SERVER_ERROR).send({ message: " error from getItems", e });
    });
};
*/

const deleteItem = (req, res , next) => {
  const { itemId } = req.params;
  // const { _id: userId} = req.user; //
  // console.log(itemId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {

      if (!item.owner.equals(req.user._id)) {

        return  next(new ForbiddenError("You can't delete someone else's card"));
       // return res.status(FORBIDDEN).send({message:"You cant delete someone else card"})
      }

      return ClothingItem.deleteOne(item).then(() =>
        res.status(200).send({ message: "Item was deleted" })
      );

    })
    .catch((err) => {
      console.log(err);

      if (err.name === "DocumentNotFoundError")
        next(new NotFound("card not found"));
      //  return res.status(NOT_FOUND).send({ message: "card not found" });
      if (err.name === "CastError")
        next(new BadRequestError("invalid request"));
      // return res.status(INVALID).send({ message: "invalid request" });

      // return res.status(SERVER_ERROR).send({message:"There has been an error with the server"});
      next(err);
    });

};

// todo put and delete likes
const addLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      // when it is succesful
      res.status(200).send({updatedItem, message: "like was succesfully added" });

    })
    .catch((err) => {
      // console.log(err.name);
      if (err.name === "DocumentNotFoundError"){
        next(new NotFound("card not found"));
       // return res.status(NOT_FOUND).send({ message: "card not found" });
      }
      if (err.name === "CastError"){
        next(new BadRequestError("invalid request"))
       // return res.status(INVALID).send({ message: "invalid request " });
      }
       next(err);
       // return res.status(SERVER_ERROR).send({ message: "There has been an error with the server" });
    });
};

const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      // when it is succesful
      res
        .status(200)
        .send({ updatedItem, message: "like was succesfully removed" });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "DocumentNotFoundError")
        next(new NotFound("card not found"))
      // return res.status(NOT_FOUND).send({ message: "card not found" });
      if (err.name === "CastError")
        next(new BadRequestError("invalid request"));
      // return res.status(INVALID).send({ message: "invalid request" });
  next(err);
   // return res.status(SERVER_ERROR).send({ message: "There has been an error with the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  // updateItem,
  deleteItem,
  addLike,
  removeLike,
};
