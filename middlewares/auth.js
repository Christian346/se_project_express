const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

function middlewareAuth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // means theres no token
    res.status(401).send({ message: "authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);

  } catch {
    res.status(401).send({ message: "unathorized request" });
  }

  req.user = payload; // adding a user property to request
  next(); // passing updated request to next function in line
}

module.exports = { middlewareAuth };
