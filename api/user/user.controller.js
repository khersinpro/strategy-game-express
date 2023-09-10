const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const userService = require("./user.service");
const jwt = require('jsonwebtoken');
const config = require('../../config/index');
const user = require("../../database/models/user");
const BadRequestError = require("../../errors/bad-request");

class UserController {

    /**
     * Récupération de tous les utilisateurs
     */
    async getAll(req, res, next) 
    {
        try 
        {
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
     */
    async get(req, res, next)
    {
        try
        {
            const id = req.params.id;

            if (!id || isNaN(parseInt(id)))
            {
                throw new BadRequestError('Id invalide');
            }

            // Récupération de l'utilisateur
            const user = await userService.getById(id);

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
            const { username, email, password } = req.body;
            const user = await userService.create({ username, email, password });
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

            if (!id || isNaN(parseInt(id)))
            {
                throw new BadRequestError('Id invalide');
            }

            const data = req.body;
            const userUpdated = await userService.update(id, data);

            if (userUpdated == 0 || !userUpdated )
            {
                throw new NotFoundError('Utilisateur introuvable pour mise à jour');
            }

            res.status(200).json('Utilisateur mis à jour');
        }
        catch (error)
        {
            next(error);
        }
    }    

    /**
     * Suppression d'un utilisateur
     */
    async delete (req, res, next) 
    {
        try 
        {
            const id = req.params.id;

            if (!id || isNaN(parseInt(id)))
            {
                throw new BadRequestError('Id invalide');
            }

            await userService.delete(id);
            req.io.emit('user:delete', {id})
            res.status(204).send();
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    async login (req, res, next)
    {
        try 
        {
            const {email, password} = req.body;

            if (!email || !password || email === '' || password === '' || email === undefined || password === undefined)
            {
                throw new UnauthorizedError('Email et mot de passe requis');
            }

            const user = await userService.getByEmail(email);

            if (!user)
            {
                throw new UnauthorizedError('Email ou mot de passe incorrect');
            }

            if (!user.checkPassword(password))
            {
                throw new UnauthorizedError('Email ou mot de passe incorrect');
            }

            const token = jwt.sign({id: user.id}, config.jwtSecret, {expiresIn: '7d'});

            res.status(200).json({user: user.id, token});
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

            const user = await userService.getById(id);

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