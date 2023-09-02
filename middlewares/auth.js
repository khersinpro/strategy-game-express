const config = require('../config');
const UnauthorizedError = require('../errors/unauthorized');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try
    {
        const token = req.headers['authorization'];

        if (!token)
        {
            throw new UnauthorizedError('Token manquant');
        }

        const extractedToken = token.split(' ')[1];

        const decodedToken = jwt.verify(extractedToken, config.jwtSecret);
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