'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Village_new_construction model class
 */
class Village_new_construction extends Model {
    /**
     * Initializes the Village_new_construction model
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
            building_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'building',
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
            }
        }, {
            sequelize,
            modelName: 'Village_new_construction',
            tableName: 'village_new_construction'
        });
    }

    /**
     * Initializes associations for the Village_new_construction model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Village_construction_progress, {
            foreignKey: 'id'
        })
        this.belongsTo(models.Building, {
            foreignKey: 'building_name'
        })
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id'
        })
    }

    /**
      * Other model methods
     */
}

module.exports = Village_new_construction;