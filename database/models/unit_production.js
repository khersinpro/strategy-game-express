'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Unit_production model class
 */
class Unit_production extends Model {
    /**
     * Initializes the Unit_production model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            reduction_percent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            military_building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'military_building',
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
                    fields: ['military_building_name', 'building_level_id']
                }
            ],
            sequelize,
            modelName: 'Unit_production',
            tableName: 'unit_production'
        });
    }

    /**
     * Initializes associations for the Unit_production model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Military_building, {
            foreignKey: 'military_building_name'
        })
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id',
            as: 'building_level'
        })
    }

    /**
     * Other methods
     */
}

module.exports = Unit_production;