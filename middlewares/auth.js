const config = require('../config');
const UnauthorizedError = require('../errors/unauthorized');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try
    {
        const token = req.headers['x-access-token'];
        if (!token)
        {
            throw new UnauthorizedError('Token manquant');
        }

        const decodedToken = jwt.verify(token, config.jwtSecret);
        if (!decodedToken)
        {
            throw new UnauthorizedError('Token invalide');
        }

        req.user = decodedToken;

        next();
    }
    catch (error)
    {
        next(error);
    }
};