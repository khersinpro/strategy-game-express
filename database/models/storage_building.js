'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Storage_building model class
 */
class Storage_building extends Model {
    /**
     * Initializes the Storage_building model
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
                allowNUll: false,
                references: {
                    model: 'resource',
                    key: 'name'
                }
            }
        }, {
            sequelize,
            modelName: 'Storage_building',
            tableName: 'storage_building'
        });
    }

    /**
     * Initializes associations for the Storage_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'name'
        });
        this.belongsTo(models.Resource, {
            foreignKey: 'resource_name'
        });
        this.hasMany(models.Storage_capacity, {
            foreignKey: 'storage_building_name'
        });
    }

    /**
     * Other methods
     */
}

module.exports = Storage_building;