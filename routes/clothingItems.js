const router = require('express').Router();
const {createItem , getItems ,/* updateItem */deleteItem ,addLike , removeLike} = require('../controllers/clothingItems')
const {middlewareAuth} = require("../middlewares/auth")
// CRUD

// Create
router.post("/", middlewareAuth, createItem);

// Read
router.get('/', getItems);

// Update
// router.put('/:itemId' ,updateItem)

router.put("/:itemId/likes",middlewareAuth, addLike);
// delete
router.delete('/:itemId',middlewareAuth , deleteItem)

router.delete('/:itemId/likes', middlewareAuth, removeLike);
module.exports = router;