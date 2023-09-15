const NotFoundError = require('../../errors/not-found');
const RoleService = require('./role.service'); 
 
class UserController {

    /**
     * Get all roles
     */
    async getAll(req, res, next) {
        try
        {
            const roles = await RoleService.getAll()
            res.status(200).json(roles)
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Get role by its id
     * @throws {NotFoundError} if the role does not exist
     */
    async get(req, res, next) {
        try
        {
            const name = req.params.name

            const role = await RoleService.getByName(name)

            if (!role)
            {
                throw new NotFoundError('Role not found')
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
     */
    async update(req, res, next) {
        try
        {
            await RoleService.update(req.params.name, req.body)
            res.status(204).send()
        }
        catch (error)
        {
            next(error)
        }
    }

    /**
     * Delete a role
     */
    async delete(req, res, next) {
        try
        {
            const name = req.params.name

            await RoleService.delete(name)

            res.status(204).send()
        }
        catch (error)
        {
            next(error)
        }
    }
 }

 module.exports = new UserController();