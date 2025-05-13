const JWT_SECRET= process.env.NODE_ENV === "production" ? process.env.JWT_SECRET : "secret-key";

//  const {JWT_SECRET = 'dev-secret' } = process.env;
module.exports = {JWT_SECRET};