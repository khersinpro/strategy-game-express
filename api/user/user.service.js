const bcrypt = require('bcrypt');
const { User } = require('../../database/index');

class UserService {
    /**
     * @returns {Promise<Array<User>>} - tous les utilisateurs
     */
    getAll() {
        return User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
    }

    /**
     * @param {string} id 
     * @returns {Promise<User>} - un utilisateur
     */
    get(id) {
        return User.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });
    }

    /**
     * 
     * @param {Object} data 
     * @returns {Promise<User>} - un utilisateur
     */
    create(data) {
        return User.create(data);
    }

    /**
     * 
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<User>} - un utilisateur
     */
    update(id, data) {
        return User.update(data, {
            where: {
                id
            }
        });
    }   

    /**
     * @param {string} id
     */
    delete(id) {
        return User.destroy({
            where: {
                id
            }
        });
    }
}

module.exports = new UserService();