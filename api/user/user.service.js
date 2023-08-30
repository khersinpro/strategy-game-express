const bcrypt = require('bcrypt');

class UserService {
    /**
     * @returns {Promise<Array<User>>} - tous les utilisateurs
     */
    getAll() {

    }

    /**
     * @param {string} id 
     * @returns {Promise<User>} - un utilisateur
     */
    get(id) {

    }

    /**
     * 
     * @param {Object} data 
     * @returns {Promise<User>} - un utilisateur
     */
    create(data) {

    }

    /**
     * 
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<User>} - un utilisateur
     */
    update(id, data) {

    }   

    /**
     * @param {string} id
     */
    delete(id) {

    }

    /**
     * Controle du mot de passe utilisateur et retourn l'utilisateur ou un false
     * @param {String} email 
     * @param {String} password 
     * @returns {Promise<User> || false} - un utilisateur ou false
     */
    async checkUserPassword (email, password) {

    }
}

module.exports = new UserService();