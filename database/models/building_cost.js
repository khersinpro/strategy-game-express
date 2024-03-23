'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Building_cost model class
 */
class Building_cost extends Model {
    /**
     * Initializes the Building_cost model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            resource_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'resource',
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
            indexes: [
                {
                    unique: true,
                    fields: ['resource_name', 'building_level_id']
                }
            ],
            sequelize,
            modelName: 'Building_cost',
            tableName: 'building_cost'
        });
    }

    /**
     * Initializes associations for the Building_cost model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Resource, {
            foreignKey: 'resource_name'
        })
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id'
        })
    }

    /**
     * Other model operations
     */
}

module.exports = Building_cost;