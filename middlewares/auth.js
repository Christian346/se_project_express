const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INCORRECT_PASSWORD } = require("../utils/errors");

function middlewareAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // means theres no token
    return res.status(INCORRECT_PASSWORD).send({ message: "authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);

  } catch {
    return res.status(INCORRECT_PASSWORD).send({ message: "unathorized request" });
  }

  req.user = payload; // adding a user property to request
  return next(); // passing updated request to next function in line
}
// return value isnt really used in middleware express just ignores it.
module.exports = { middlewareAuth };
