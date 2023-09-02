const { User } = require('../../database/index').models;

class UserService {
    /**
     * Récupérer tous les utilisateurs
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
     * Récupérer un utilisateur par son id
     * @param {String} id id de l'utilisateur
     * @returns {Promise<User>} - un utilisateur
     */
    getById(id) {
        return User.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });
    }

    /**
     * Récupérer un utilisateur par son email
     * @param {String} email email fournit par l'utilisateur 
     * @returns {Promise<User>} - un utilisateur
     */
    getByEmail(email) {
        return User.findOne({
            where: {
                email
            }
        });
    }  

    /**
     * Créer un utilisateur
     * @param {Object} data données de l'utilisateur
     * @returns {Promise<User>} - un utilisateur
     */
    create(data) {
        return User.create(data);
    }

    /**
     * Mettre à jour un utilisateur
     * @param {String} id  id de l'utilisateur
     * @param {Object} data  données de l'utilisateur
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
     * Mettre à jour le mot de passe d'un utilisateur
     * @param {String} id id de l'utilisateur
     * @returns {Promise} 
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