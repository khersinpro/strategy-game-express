'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Map_position model class
 */
class Map_position extends Model {
    /**
     * Initializes the Map_position model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            map_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'map',
                    key: 'id'
                }
            },
            x: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            y: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            target_entity_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            target_type: {
                type: DataTypes.ENUM('village', 'empty'),
                defaultValue: 'empty',
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Map_position',
            tableName: 'map_position',
            indexes: [
                {
                    unique: true,
                    fields: ['x', 'y', 'map_id']
                },
                {
                    unique: true,
                    fields: ['target_entity_id', 'target_type', 'map_id']
                }
            ]
        });
    }

    /**
     * Initializes associations for the Map_position model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Map, {
            foreignKey: 'map_id',
            as: 'map',
            onDelete: 'CASCADE'
        });
        // polymorphic associations
        this.belongsTo(models.Village, {
            foreignKey: 'target_entity_id',
            constraints: false,
        });
    }

    /**
     * Other model methods
     */

    /**
     * add a village this map position
     * @param {Village} village 
     */
    async addVillage(village) {
        try {
            this.target_entity_id = village.id;
            this.target_type = 'village';
            await this.save();
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = Map_position;