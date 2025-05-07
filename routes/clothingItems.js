const router = require('express').Router();
const {createItem , getItems ,/* updateItem */deleteItem ,addLike , removeLike} = require('../controllers/clothingItems')
const {middlewareAuth} = require("../middlewares/auth")
const {validateClothingItem , validateId} = require("../middlewares/validation")
// every endpoint in this file will have /items first ! and
// likewise for the users it will /users

// CRUD



// Create
router.post("/", middlewareAuth, validateClothingItem , createItem); // has to be validated

// Read
router.get('/', getItems);

// Update
// router.patch('/:itemId' ,updateItem)

router.put("/:itemId/likes",middlewareAuth, validateId, addLike); // only the id needs to be validated
// delete
router.delete('/:itemId',middlewareAuth, validateId , deleteItem) // only the id needs to be validated
// http://localhost:3001/items/12e12e12e12de

// req.params = {itemId: 12e12e12e12de}

router.delete('/:itemId/likes', middlewareAuth, validateId, removeLike);
module.exports = router;