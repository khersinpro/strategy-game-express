const NotFoundError = require('../../errors/not-found');
const { User } = require('../../database/index').models;

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
            }
        });
    }

    /**
     * get a user by its email
     * @param {String} email user email
     * @returns {Promise<User>} - a user
     */
    getByEmail(email) {
        return User.findOne({
            where: {
                email
            }
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
        const user = await this.getById(id);

        if (!user) 
        {
            throw new NotFoundError(`User with primary key ${id} not found`);
        }

        return user.update(data);
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
}

module.exports = new UserService();