const config = require('../config');
const UnauthorizedError = require('../errors/unauthorized');
const userService = require('../api/user/user.service');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/not-found');

exports.auth = async (req, res, next) => {
    try
    {
        const token = req.headers['authorization'];

        if (!token)
        {
            throw new UnauthorizedError('Token manquant');
        }

        const extractedToken = token.split(' ')[1];

        const decodedToken = jwt.verify(extractedToken, config.jwtSecret);

        if (!decodedToken || !decodedToken.id)
        {
            throw new UnauthorizedError('Token invalide');
        }

        const user = await userService.getById(decodedToken.id);


        if (!user)
        {
            throw new NotFoundError('Utilisateur introuvable');
        }

        req.user = user;

        next();
    }
    catch (error)
    {
        next(error);
    }
};

exports.isAdmin = async (req, res, next) => {
    try
    {
        if (req.user.role !== 'ROLE_ADMIN')
        {
            throw new UnauthorizedError('You are not allowed to access this resource');
        }

        next();
    }
    catch (error)
    {
        next(error);
    }
}