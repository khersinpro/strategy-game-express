
/**
 * @class NotFoundError
 */
class NotFoundError extends Error {
    status = 404;
    constructor(message) {
        super(message);
    }
}

module.exports = NotFoundError;