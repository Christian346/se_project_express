const  INVALID =  400;
const  NOT_FOUND = 404;
const  SERVER_ERROR = 500;
const CONFLICT_ERROR = 409;
const INCORRECT_PASSWORD = 401;

class UserNotFound extends Error {
    constructor(message) {
        super(message)
        this.name = "UserNotFound";
        this.message = message;
        this.status = NOT_FOUND;
    }
}



module.exports = {INVALID , NOT_FOUND , SERVER_ERROR , CONFLICT_ERROR, UserNotFound, INCORRECT_PASSWORD}