'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Resource_building model class
 */
class Resource_building extends Model {
    /**
     * Initializes the Resource_building model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'building',
                    key: 'name'
                }
            },
            resource_name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                references: {
                    model: 'resource',
                    key: 'name'
                }
            }
        }, {
            sequelize,
            modelName: 'Resource_building',
            tableName: 'resource_building'
        });
    }

    /**
     * Initializes associations for the Resource_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'name'
        })
        this.belongsTo(models.Resource, {
            foreignKey: 'resource_name'
        })
        this.hasMany(models.Resource_production, {
            foreignKey: 'resource_building_name'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Resource_building;