'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Resource_production model class
 */
class Resource_production extends Model {
    /**
     * Initializes the Resource_production model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            production: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            resource_building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'resource_building',
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
            },
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['resource_building_name', 'building_level_id']
                }
            ],
            sequelize,
            modelName: 'Resource_production',
            tableName: 'resource_production'
        });
    }

    /**
     * Initializes associations for the Resource_production model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Resource_building, {
            foreignKey: 'resource_building_name'
        })
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id',
            as: 'building_level'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Resource_production;