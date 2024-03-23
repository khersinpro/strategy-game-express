'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Civilization model class
 */
class Civilization extends Model {
    /**
     * Initializes the Civilization model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            }
        }, {
            sequelize,
            modelName: 'Civilization',
            tableName: 'civilization',
        });
    }

    /**
     * Initializes associations for the Civilization model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.hasMany(models.Village, {
            foreignKey: 'civilization_name'
        })
        this.hasMany(models.Unit, {
            foreignKey: 'civilization_name'
        })
        this.hasMany(models.Special_building, {
            foreignKey: 'civilization_name'
        })
        this.hasMany(models.Wall_building, {
            foreignKey: 'civilization_name'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Civilization;