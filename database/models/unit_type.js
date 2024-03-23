'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Unit_type model class
 */
class Unit_type extends Model {
    /**
     * Initializes the Unit_type model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            }
        }, {
            sequelize,
            modelName: 'Unit_type',
            tableName: 'unit_type',
        });
    }

    /**
     * Initializes associations for the Unit_type model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        Unit_type.hasMany(models.Unit, {
            foreignKey: 'unit_type',
            as: 'units'
        });
        Unit_type.hasMany(models.Defense_type, {
            foreignKey: 'type',
        });
    }

    /**
     * Other methods
     */
}

module.exports = Unit_type;