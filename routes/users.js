const router = require("express").Router();
 const { /* getUsers ,  createUser */ getCurrentUser, updateUser} = require("../controllers/users");
 const { middlewareAuth } = require("../middlewares/auth");


// ALL HTTP METHODS
// router.get("/", getUsers);
 router.get("/me",middlewareAuth ,getCurrentUser);
 router.patch("/me", middlewareAuth, updateUser);
// router.post("/", createUser);


//

module.exports = router;
