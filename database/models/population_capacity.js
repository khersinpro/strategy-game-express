'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Population_capacity model class
 */
class Population_capacity extends Model {
    /**
     * Initializes the Population_capacity model
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
            town_all_building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'town_all_building',
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
                fields: ['town_all_building_name', 'building_level_id']
            }],
            sequelize,
            modelName: 'Population_capacity',
            tableName: 'population_capacity'
        });
    }

    /**
     * Initializes associations for the Population_capacity model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Town_all_building, {
            foreignKey: 'town_all_building_name',
        });
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id',
            as: 'building_level'
        });
    }

    /**
     * Other model methods
     */
}

module.exports = Population_capacity;