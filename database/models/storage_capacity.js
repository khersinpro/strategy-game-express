'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Storage_capacity model class
 */
class Storage_capacity extends Model {
    /**
     * Initializes the Storage_capacity model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            storage_building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'storage_building',
                    key: 'name'
                }
            },
            building_level_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'building_level',
                    key: 'id'
                }
            }
        }, {
            indexes: [{
                unique: true,
                fields: ['storage_building_name', 'building_level_id']
            }],
            sequelize,
            modelName: 'Storage_capacity',
            tableName: 'storage_capacity'
        });
    }

    /**
     * Initializes associations for the Storage_capacity model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Storage_building, {
            foreignKey: 'storage_building_name',
            as: 'storage_building'
        });
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id',
            as: 'building_level'
        });
    }

    /**
     * Other methods
     */
}

module.exports = Storage_capacity;