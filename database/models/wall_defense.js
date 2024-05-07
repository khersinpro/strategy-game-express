'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Wall_defense model class
 */
class Wall_defense extends Model {
    /**
     * Initializes the Wall_defense model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            defense_percent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            wall_building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'wall_building',
                    key: 'name'
                }
            },
            building_level_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'building_level',
                    key: 'id'
                }
            },
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['wall_building_name', 'building_level_id']
                }
            ],
            sequelize,
            modelName: 'Wall_defense',
            tableName: 'wall_defense'
        });
    }

    /**
     * Initializes associations for the Wall_defense model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Wall_building, {
            foreignKey: 'wall_building_name'
        })
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id',
            as: 'building_level'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Wall_defense;