'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Special_building model class
 */
class Special_building extends Model {
    /**
     * Initializes the Special_building model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'buildings',
                    key: 'name'
                }
            },
            civilization_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'civilization',
                    key: 'name'
                }
            }
        }, {
            sequelize,
            modelName: 'Special_building',
            tableName: 'special_building'
        });
    }

    /**
     * Initializes associations for the Special_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'name'
        })
        this.belongsTo(models.Civilization, {
            foreignKey: 'civilization_name'
        })
    }

    /**
     * Other methods
     */
}

module.exports = Special_building;