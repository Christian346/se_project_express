const router = require("express").Router();
const clothingItemRouter = require('./clothingItems')
const userRouter = require("./users");
const {NOT_FOUND } = require("../utils/errors");
const {createUser} = require("../controllers/users")

router.use("/users" , userRouter);
router.use('/items', clothingItemRouter); // this is the default route
router.post('/signup', createUser) // accepts post request to register
// routers here are subrouter




router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
})

module.exports = router;