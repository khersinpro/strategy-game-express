'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Village_update_construction model class
 */
class Village_update_construction extends Model {
    /**
     * Initializes the Village_update_construction model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.INTEGER,
                references: {
                    model: 'village_construction_progress',
                    key: 'id'
                }
            },
            village_building_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'village_building',
                    key: 'id'
                }
            },
            building_level_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                reference: {
                    model: 'building_level',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'Village_update_construction',
            tableName: 'village_update_construction'
        });
    }

    /**
     * Initializes associations for the Village_update_construction model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Village_construction_progress, {
            foreignKey: 'id'
        })
        this.belongsTo(models.Village_building, {
            foreignKey: 'village_building_id'
        })
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id'
        })
    }

    /**
     * Other model methods
     */
}

module.exports = Village_update_construction;