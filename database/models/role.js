'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Role model class
 */
class Role extends Model {
    /**
     * Initializes the Role model
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
            modelName: 'Role',
            tableName: 'role',
        });
    }

    /**
     * Initializes associations for the Role model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.hasMany(models.User, {
            foreignKey: 'role_name'
        })
    }

    /**
     * Other methods
     */
}

module.exports = Role;