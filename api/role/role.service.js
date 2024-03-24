const NotFoundError = require('../../errors/not-found');
const Role          = require('../../database/models/role');

class RoleService {
    /**
     * Returns all roles
     * @returns {Promise<Array<Role>} all roles
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
        const res = await Role.update(data, {
            where: { name }
        });
        
        if (parseInt(res) === 0) {
            throw new NotFoundError(`Role with primary key ${name} not found or no changes added`);
        }
        
        return res
    }

    /**
     * Delete a role
     * @param {String} id role id
     * @throws {NotFoundError} if the role does not exist
     * @returns {Promise<Role>} a role
     */
    async delete(name) {
        const role = await this.getByName(name);

        if (!role) 
        {
            throw new NotFoundError(`Role with primary key ${id} not found`);
        }

        return role.destroy();
    }
}

module.exports = new RoleService();