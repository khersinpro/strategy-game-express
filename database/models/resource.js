'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Resource model class
 */
class Resource extends Model {
    /**
     * Initializes the Resource model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: 'Resource',
            tableName: 'resource'
        });
    }

    /**
     * Initializes associations for the Resource model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.hasMany(models.Building_cost, {
            foreignKey: 'resource_name'
        })
        this.hasMany(models.Unit_cost, {
            foreignKey: 'resource_name'
        })
    }

    /**
     * Other methods
     */
}

module.exports = Resource;