const NotFoundError = require('../../errors/not-found');
const { User, Server } = require('../../database/index').models;
const ServerService = require('../server/server.service');

class UserService {
    /**
     * Returns all users
     * @returns {Promise<Array<User>>} - all users
     */
    getAll() {
        return User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
    }

    /**
     * get a user by its id
     * @param {String} id user id
     * @returns {Promise<User>} - a user
     */
    getById(id) {
        return User.findByPk(id, {
            attributes: {
                exclude: ['password']
            },
            include: [
                {
                model: Server,
                as: 'servers',
                attributes: ['name']
                }
            ]
        });
    }

    /**
     * get a user by its email
     * @param {String} email user email
     * @param {Boolean} withPassword if true, returns the password
     * @returns {Promise<User>} - a user
     */
    getByEmail(email, withPassword = false) {
        const exclude = withPassword ? [] : ['password'];
        
        return User.findOne({
            where: {
                email
            },
            attributes: {
                exclude
            },
            include: [
                {
                model: Server,
                as: 'servers',
                attributes: ['name']
                }
            ]
        });
    }  

    /**
     * Create a user
     * @param {Object} data user data
     * @returns {Promise<User>} - a user
     */
    create(data) {
        return User.create(data);
    }

    /**
     * Update a user
     * @param {String} id  user id
     * @param {Object} data  user data
     * @throws {NotFoundError} if the user does not exist
     * @returns {Promise<User>} - a user
     */
    async update(id, data) {
        const res = await User.findAndUpdate(data,{
            where: {
                id
            },
        });

        if (parseInt(res) === 0)
        {
            throw new NotFoundError(`User with primary key ${id} not found or not modified`);
        }

        return res
    }   

    /**
     * Delete a user
     * @param {String} id user id
     * @throws {NotFoundError} if the user does not exist
     * @returns {Promise<User>} - a delete user 
     */
    async delete(id) {
        const user = await this.getById(id);

        if (!user) 
        {
            throw new NotFoundError(`User with primary key ${id} not found`);
        }

        return user.destroy();
    }

    /**
     * Add a server to a user
     * @param {String} id user id
     * @param {String} serverName server name
     * @throws {NotFoundError} if the user or server does not exist
     * @returns {Promise<User>} - a user
     */
    async addServer(id, serverName) {
        const user = await this.getById(id);

        if (!user) 
        {
            throw new NotFoundError(`User with primary key ${id} not found`);
        }

        const server = await ServerService.getByName(serverName);

        if (!server) 
        {
            throw new NotFoundError(`Server with name ${serverName} not found`);
        }

        return user.addServer(server);
    }

    /**
     * Remove a server from a user
     * @param {String} id user id
     * @param {String} serverName server name
     * @throws {NotFoundError} if the user or server does not exist
     * @returns {Promise<User>} - a user
     */
    async removeServer(id, serverName) {
        const user = await this.getById(id);

        if (!user) 
        {
            throw new NotFoundError(`User with primary key ${id} not found`);
        }

        const server = await ServerService.getByName(serverName);

        if (!server) 
        {
            throw new NotFoundError(`Server with name ${serverName} not found`);
        }

        return user.removeServer(server);
    } 
}

module.exports = new UserService();