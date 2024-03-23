'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Building_type model class
 */
class Building_type extends Model {
    /**
     * Initializes the Building_type model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: 'Building_type',
            tableName: 'building_type'
        });
    }

    /**
     * Initializes associations for the Building_type model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.hasMany(models.Building, {
            foreignKey: 'type'
        })
        this.hasMany(models.Village_building, {
            foreignKey: 'type'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Building_type;