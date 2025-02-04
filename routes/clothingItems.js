const router = require('express').Router();
const {createItem , getItems , updateItem ,deleteItem ,addLike , removeLike} = require('../controllers/clothingItems')

// CRUD

// Create
router.post('/',createItem)

// Read
router.get('/', getItems);

// Update
router.put('/:itemId' ,updateItem)

router.put("/:itemId/likes", addLike);
// delete
router.delete('/:itemId' , deleteItem)

router.delete('/:itemId/likes', removeLike);
module.exports = router;