'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Village_building model class
 */
class Village_building extends Model {
    /**
     * Initializes the Village_building model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            village_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'village',
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.STRING,
                references: {
                    model: 'building_type',
                    key: 'name'
                },
                allowNull: false
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
            },
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['village_id', 'building_name']
                }
            ],
            sequelize,
            modelName: 'Village_building',
            tableName: 'village_building',
        });
    }

    /**
     * Initializes associations for the Village_building model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Village, {
            foreignKey: 'village_id',
        });
        this.belongsTo(models.Building, {
            foreignKey: 'building_name',
        });
        this.belongsTo(models.Building_level, {
            foreignKey: 'building_level_id',
        });
        this.belongsTo(models.Building_type, {
            foreignKey: 'type',
        });
    }

    /**
     * Other methods
     */
}

module.exports = Village_building;