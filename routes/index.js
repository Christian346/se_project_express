const router = require("express").Router();
const clothingItem = require('./clothingItems')
const userRouter = require("./users");
const {NOT_FOUND } = require("../utils/errors");
const {createUser} = require("../controllers/users")

router.use("/users" , userRouter);
router.use('/items', clothingItem);
router.post('/signup', createUser)
// routers here are subrouter




router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
})

module.exports = router;