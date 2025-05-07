const errorHandler = (error, req, res, next) => {
  // error will be always the instance of each particular request error that may happen

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  } // just to check if that property exists
  return res.status(500).json({ message: "internal error occured" });
  // express ignores the return value of middlewares
  // since error handling is the last step in the function chain there's no need for a next.
};


module.exports = errorHandler;
