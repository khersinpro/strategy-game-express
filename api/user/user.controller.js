const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const userService = require("./user.service");
const jwt = require('jsonwebtoken');
const config = require('../../config/index');

class UserController {

    /**
     * Récupération de tous les utilisateurs
     */
    async getAll(req, res, next) 
    {
        try 
        {
            // Récupération de tous les utilisateurs sans le mot de passe
            const users = await userService.getAll();
            res.status(200).json(users);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Récupération d'un utilisateur par son id
     * @reqparam {string} id - id de l'utilisateur
     */
    async get(req, res, next)
    {
        try
        {
            const id = req.params.id;
            // Récupération de l'utilisateur
            const user = await userService.get(id);

            if (!user)
            {
                throw new NotFoundError('Utilisateur introuvable');
            }

            res.status(200).json(user);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Création d'un utilisateur
     */
    async create(req, res, next) 
    {
        try 
        {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Mise a jour d'un utilisateur
     */
    async update(req, res, next) 
    {
        try
        {
            const id = req.params.id;
            const data = req.body;
            const userUpdated = await userService.update(id, data);
            res.status(200).json(userUpdated);
        }
        catch (error)
        {
            next(error);
        }
    }    

    async delete (req, res, next) 
    {
        try 
        {
            const id = req.params.id;
            await userService.delete(id);
            req.io.emit('user:delete', {id})
            res.status(204).send();
        }
        catch (error)
        {
            next(error);
        }
    }

    async login (req, res, next)
    {
        try 
        {
            const {email, password} = req.body;

            if (!email || !password || email === '' || password === '' || email === undefined || password === undefined)
            {
                throw new UnauthorizedError('Email et mot de passe requis');
            }

            const user = await userService.checkUserPassword(email, password);

            if (!user)
            {
                throw new UnauthorizedError('Email ou mot de passe incorrect');
            }
            user.password = undefined;
            const token = jwt.sign({id: user._id}, config.jwtSecret, {expiresIn: '7d'});

            res.status(200).json({user: user._id, token});
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Récupération de l'utilisateur courant
     */
    async me(req, res, next) {
        try
        {
            const id = req.user.id;

            if (!id) {
                throw new UnauthorizedError('Token invalide');
            }

            const user = await userService.get(id);

            if (!user)
            {
                throw new NotFoundError('Utilisateur introuvable');
            }

            res.status(200).json(user);

        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new UserController();