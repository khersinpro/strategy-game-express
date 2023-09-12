const BadRequestError = require('../../errors/bad-request');
const NotFoundError = require('../../errors/not-found');
const RoleService = require('./role.service'); 
 
class UserController {

    /**
     * Get all roles
     */
    async getAll(req, res, next) {
        try
        {
            const roles = RoleService.getAll()
            res.status(200).json(roles)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Get role by its id
     * @throws {BadRequestError} if the id is not a number
     * @throws {NotFoundError} if the role does not exist
     */
    async get(req, res, next) {
        try
        {
            const name = req.params.name

            if (!name || typeof name !== 'string')
            {
                throw new BadRequestError('Name invalide')
            }

            const role = await RoleService.getByName(name)

            if (!role)
            {
                throw new NotFoundError('Utilisateur introuvable')
            }

            res.status(200).json(role)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Create a role
     */
    async create(req, res, next) {
        try
        {
            const { name } = req.body
            const role = await RoleService.create({ name })
            res.status(201).json(role)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Update a role
     * @throws {BadRequestError} if the name is not a string    
     */
    async update(req, res, next) {
        try
        {
            const name = req.params.name
            
            const { newName } = req.body

            if (!name || typeof name !== 'string')
            {
                throw new BadRequestError('Name invalide')
            }

            const role = await RoleService.update(name, { name: newName })
            res.status(200).json(role)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Delete a role
     * @throws {BadRequestError} if the name is not a string
     */
    async delete(req, res, next) {
        try
        {
            const name = req.params.name

            if (!name || typeof name !== 'string')
            {
                throw new BadRequestError('Name invalide')
            }

            await RoleService.delete(name)
            //Controller si le role a bien été supprimé
            res.status(204).send()
        }
        catch (error)
        {
            next(error)
        }
    }
 }

 module.exports = new UserController();