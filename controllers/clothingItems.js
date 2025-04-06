const ClothingItem = require("../models/clothingItem");
const { INVALID, NOT_FOUND, SERVER_ERROR,FORBIDDEN } = require("../utils/errors");

// main handler of api calls
const createItem = (req, res) => {
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
        return res
          .status(INVALID)
          .send({ message: "Validation Error occured" });
      }
      return res .status(SERVER_ERROR).send({ message: "Error from the createItem"});
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})

    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.log(e);
      res.status(SERVER_ERROR).send({ message: " error from getItems"});
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  // const { _id: userId} = req.user; //
  // console.log(itemId);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res.status(FORBIDDEN).send({message:"You cant delete someone else card"})
      }
      return ClothingItem.deleteOne(item).then(() => res.status(200).send({message: "Item was deleted"}));

    })
    .catch((err) => {
      console.log(err);

      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND).send({ message: "card not found" });
      if (err.name === "CastError")
       return res.status(INVALID).send({ message: "invalid request" });

      return res.status(SERVER_ERROR).send({message:"There has been an error with the server"});
    });

};

// todo put and delete likes
const addLike = (req, res) => {
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
       return res.status(NOT_FOUND).send({ message: "card not found" });
      }
      if (err.name === "CastError"){
       return res.status(INVALID).send({ message: "invalid request " });
      }

       return res.status(SERVER_ERROR).send({ message: "There has been an error with the server" });
    });
};

const removeLike = (req, res) => {
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
       return res.status(NOT_FOUND).send({ message: "card not found" });
      if (err.name === "CastError")
       return res.status(INVALID).send({ message: "invalid request" });

    return res.status(SERVER_ERROR).send({ message: "There has been an error with the server" });
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
