'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Wall_building model class 
 */
class Wall_building extends Model {
    /**
     * Initializes the Wall_building model
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
                unique: true,
                references: {
                    model: 'civilization',
                    key: 'name'
                }
            },
        }, {
            sequelize,
            modelName: 'Wall_building',
            tableName: 'wall_building'
        });
    }

    /**
     * Initializes associations for the Wall_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'name',
        });
        this.belongsTo(models.Civilization, {
            foreignKey: 'civilization_name'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Wall_building;