'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Military_building model class
 */
class Military_building extends Model {
    /**
     * Initializes the Military_building model
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
            unit_type: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                references: {
                    model: 'unit_type',
                    key: 'type',
                }
            }
        }, {
            sequelize,
            modelName: 'Military_building',
            tableName: 'military_building'
        });
    }

    /**
     * Initializes associations for the Military_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'name'
        })
        this.hasMany(models.Unit, {
            foreignKey: 'military_building'
        })
        this.belongsTo(models.Unit_type, {
            foreignKey: 'unit_type',
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Military_building;