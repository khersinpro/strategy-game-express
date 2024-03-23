'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Building_level model class
 */
class Building_level extends Model {
    /**
     * Initializes the Building_level model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'building',
                    key: 'name'
                }
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            time: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Building_level',
            tableName: 'building_level',
            indexes: [
                {
                    unique: true,
                    fields: ['building_name', 'level']
                }
            ]
        });
    }

    /**
     * Initializes associations for the Building_level model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Building, {
            foreignKey: 'building_name'
        })
        this.hasMany(models.Resource_production, {
            foreignKey: 'building_level_id'
        })
        this.hasMany(models.Building_cost, {
            foreignKey: 'building_level_id'
        })
        this.hasMany(models.Village_building, {
            foreignKey: 'building_level_id'
        })
        this.hasMany(models.Storage_capacity, {
            foreignKey: 'building_level_id'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Building_level;