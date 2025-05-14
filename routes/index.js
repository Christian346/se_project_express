const router = require("express").Router();
const clothingItemRouter = require('./clothingItems')
const userRouter = require("./users");
const {NOT_FOUND } = require("../utils/errors");
const {createUser} = require("../controllers/users");
const { validateUserCreation } = require("../middlewares/validation");
const NotFoundError = require("../Errors/NotFoundError")


router.use("/users" , userRouter);
router.use('/items', clothingItemRouter); // this is the default route
router.post('/signup',validateUserCreation ,createUser) // accepts post request to register
// routers here are subrouter




router.use((req, res , next) => {
    next(new NotFoundError("Requested resource not found"))
 // res.status(NOT_FOUND).send({ message: "Requested resource not found" });
})

module.exports = router;