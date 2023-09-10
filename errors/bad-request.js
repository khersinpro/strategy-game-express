
/**
 * @class BadRequestError
 */
class BadRequestError extends Error {
    status = 400;
    constructor(message) {
        super(message);
    }
}

module.exports = BadRequestError;