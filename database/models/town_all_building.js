'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Town_all_building model class
 */
class Town_all_building extends Model {
    /**
     * Initializes the Town_all_building model
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
        }, {
            sequelize,
            modelName: 'Town_all_building',
            tableName: 'town_all_building'
        });
    }

    /**
     * Initializes associations for the Town_all_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'name',
        });
    }

    /**
     * Other methods
     */
}

module.exports = Town_all_building;