'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Users_servers model class
 */
class users_servers extends Model {
    /**
     * Initializes the Users_servers model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'user',
                    key: 'id'
                }
            },
            server_name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'server',
                    key: 'name'
                }
            }
        }, {
            sequelize,
            modelName: 'users_servers',
        });
    }

    /**
     * Initializes associations for the Users_servers model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) { }
}

module.exports = users_servers;