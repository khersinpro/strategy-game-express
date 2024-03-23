'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Unit model class
 */
class Unit extends Model {
    /**
     * Initializes the Unit model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            attack: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            carrying_capacity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            movement_speed: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            population_cost: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            training_time: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            unit_type: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'unit_type',
                    key: 'type'
                }
            },
            civilization_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'civilization',
                    key: 'name'
                }
            },
            military_building: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'military_building',
                    key: 'name'
                }
            },
        }, {
            sequelize,
            modelName: 'Unit',
            tableName: 'unit',
        });
    }

    /**
     * Initializes associations for the Unit model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        Unit.belongsTo(models.Unit_type, {
            foreignKey: 'unit_type',
        });
        Unit.hasMany(models.Defense_type, {
            foreignKey: 'unit_name',
        });
        Unit.belongsTo(models.Civilization, {
            foreignKey: 'civilization_name',
        });
        Unit.belongsTo(models.Military_building, {
            foreignKey: 'name',
        });
        Unit.hasMany(models.Unit_cost, {
            foreignKey: 'unit_name',
        });
    }

    /**
     * Other methods
     */
}

module.exports = Unit;