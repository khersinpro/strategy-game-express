'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Unit_cost model class
 */
class Unit_cost extends Model {
    static initialize(sequelize) {
        this.init({
            unit_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'unit',
                    key: 'name'
                }
            },
            resource_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'resource',
                    key: 'name'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Unit_cost',
            tableName: 'unit_cost',
            indexes: [
                {
                    unique: true,
                    fields: ['unit_name', 'resource_name']
                }
            ]
        });
    }

    /**
     * Initializes associations for the Unit_cost model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Unit, {
            foreignKey: 'unit_name'
        })
        this.belongsTo(models.Resource, {
            foreignKey: 'resource_name'
        })
    }

    /**
     * Other methods
     */
}

module.exports = Unit_cost;