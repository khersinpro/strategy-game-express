'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Attack_stolen_resource model class
 */
class Attack_stolen_resource extends Model {
    /**
     * Initializes the Attack_stolen_resource model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            resource_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'resource',
                    key: 'name'
                }
            },
            attack_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'attack',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'Attack_stolen_resource',
            tableName: 'attack_stolen_resource',
            indexes: [
                {
                    unique: true,
                    fields: ['attack_id', 'resource_name']
                }
            ]
        });
    }

    /**
     * Initializes associations for the Attack_stolen_resource model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Attack, {
            foreignKey: 'attack_id',
        });
        this.belongsTo(models.Resource, {
            foreignKey: 'resource_name',
        });
    }

    /**
     * Other model methods
     */
}

module.exports = Attack_stolen_resource;