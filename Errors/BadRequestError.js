class BadRequestError extends Error {
  constructor(message){
    super(message)
   this.statusCode = 400;
  //  this.s
  }

}

module.exports = BadRequestError;