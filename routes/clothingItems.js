const router = require('express').Router();
const {createItem , getItems ,/* updateItem */deleteItem ,addLike , removeLike} = require('../controllers/clothingItems')
const {middlewareAuth} = require("../middlewares/auth")
// every endpoint in this file will have /items first ! and
// likewise for the users it will /users

// CRUD



// Create
router.post("/", middlewareAuth, createItem); //

// Read
router.get('/', getItems);

// Update
// router.patch('/:itemId' ,updateItem)

router.put("/:itemId/likes",middlewareAuth, addLike);
// delete
router.delete('/:itemId',middlewareAuth , deleteItem)

router.delete('/:itemId/likes', middlewareAuth, removeLike);
module.exports = router;