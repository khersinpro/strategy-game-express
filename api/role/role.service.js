const Role = require('../../database/index').models
const NotFoundError = require('../../errors/not-found');

class RoleService {

    /**
     * Returns all roles
     * @returns {Promise<Array<User>} all roles
     */
    getAll() {
        return Role.findAll();
    }

    /**
     * Returns a role by its name
     * @param {String} name role name
     * @returns {Promise<Role>} a role
     */
    getByName(name) {
        return Role.findByPk(name);
    }

    /**
     * Create a role
     * @param {Object} data role data
     * @returns {Promise<Role>} a role
    */
   create(data) {
    return Role.create(data);
   }

    /**
     * Update a role
     * @param {String} name role name
     * @param {Object} data role data
     * @throws {NotFoundError} if the role does not exist
     * @returns {Promise<Role>} a role
     */
    async update (name, data) {
        const role = await this.getByName(name);

        if (!role) 
        {
            throw new NotFoundError(`Role with primary key ${name} not found`);
        }

        return role.update(data);
    }

    /**
     * Delete a role
     * @param {String} id role id
     * @throws {NotFoundError} if the role does not exist
     * @returns {Promise<Role>} a role
     */
    async delete(id) {
        const role = await this.getById(id);

        if (!role) 
        {
            throw new NotFoundError(`Role with primary key ${id} not found`);
        }

        return role.destroy();
    }
}

module.exports = new RoleService();