'use strict';
const { Model, DataTypes } = require('sequelize');
const Resource = require('./resource');
const Unit_cost = require('./unit_cost');
const Unit_type = require('./unit_type');
const Defense_type = require('./defense_type');

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
     * Initializes hooks for the Unit model
     * @returns {void}
     */
    static setHooks() {
        this.afterCreate(async (unit, options) => {
            try {
                await Promise.all([
                    unit.#generateUnitCosts(),
                    unit.#generateUnitDefenseTypes()
                ])
            } catch (error) {
                throw error;
            }
        })
    }

    /**
     * Other methods
     */

    /**
     * Generates unit costs for the unit where the unit is created
     * @private
     * @returns {Promise<void>}
     */
    async #generateUnitCosts() {
        try {
            const resources = await Resource.findAll();
            const promises = resources.map(async resource => {
                return Unit_cost.create({
                    unit_name: this.name,
                    resource_name: resource.name,
                    quantity: 0
                });
            });

            await Promise.all(promises);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generates defense types for the unit where the unit is created
     * @private
     * @returns {Promise<void>}
     */
    async #generateUnitDefenseTypes() {
        const unitTypes = await Unit_type.findAll();
        const promises = unitTypes.map(async unitType => {
            return Defense_type.create({
                unit_name: this.name,
                type: unitType.type,
                defense_value: 10
            });
        });

        await Promise.all(promises);
    }
}

module.exports = Unit;