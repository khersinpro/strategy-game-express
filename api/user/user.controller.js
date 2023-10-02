const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const userService = require("./user.service");
const jwt = require('jsonwebtoken');
const config = require('../../config/index');

class UserController {

    /**
     * Get all users
     */
    async getAll (req, res, next) 
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
     * Get user by its id
     */
    async get (req, res, next)
    {
        try
        {
            const id = req.params.id;

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
     * Create a user
     */
    async create (req, res, next) 
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
     * Update a user
     */
    async update (req, res, next) 
    {
        try
        {
            const id = req.params.id;
            const data = req.body;

            if (data.role && req.user.role !== 'ROLE_ADMIN')
            {
                throw new UnauthorizedError('You are not allowed to change user role');
            }

            await userService.update(id, data);
            res.status(204).send();
        }
        catch (error)
        {
            next(error);
        }
    }    

    /**
     * Delete a user
     */
    async delete (req, res, next) 
    {
        try 
        {
            const id = req.params.id;
            await userService.delete(id);
            req.io.emit('user:delete', { id })
            res.status(204).send();
        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Login
     */
    async login (req, res, next)
    {
        try 
        {
            const { email, password } = req.body;

            const user = await userService.getByEmail(email, true);

            if (!user)
            {
                throw new UnauthorizedError('Invalid credentials');
            }

            if (!user.checkPassword(password))
            {
                throw new UnauthorizedError('Invalid credentials');
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
     * Get current user
     */
    async me (req, res, next) {
        try
        {
            res.status(200).json(req.user);

        }
        catch (error)
        {
            next(error);
        }
    }

    /**
     * Add a server to user
     */
    async addServer (req, res, next) {
        try
        {
            const id = req.params.id;
            const server = req.body.server;

            await userService.addServer(id, server);
            res.status(204).send();
        }
        catch (error)
        {
            next(error);
        }
    } 

    /**
     * Delete a server to user
     */
    async removeServer (req, res, next) {
        try 
        {
            const id = req.params.id;
            const serveur = req.body.server;

            await userService.removeServer(id, serveur);
            res.status(204).send();
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new UserController();