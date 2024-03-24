'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Server model class
 */
class Server extends Model {
    /**
     * Initializes the Server model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Server',
            tableName: 'server',
        });
    }

    /**
     * Initializes associations for the Server model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        // this.belongsToMany(models.User, {
        //     through: 'users_servers',
        //     foreignKey: 'server_name',
        //     otherKey: 'user_id'
        // })
    }

    /**
     * Other methods
     */
}

module.exports = Server;