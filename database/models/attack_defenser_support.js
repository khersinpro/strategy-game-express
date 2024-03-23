'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Attack_defenser_support model class
 */
class Attack_defenser_support extends Model {
    /**
     * Initializes the Attack_defenser_support model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            sent_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            lost_quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            attack_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'attack',
                    key: 'id'
                }
            },
            supporting_unit_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'supporting_unit',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'Attack_defenser_support',
            tableName: 'attack_defenser_support',
            indexes: [
                // {
                //   unique: true,
                //   fields: ['attack_id', 'village_support_id']
                // }
            ]
        });
    }

    /**
     * Initializes associations for the Attack_defenser_support model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Attack, {
            foreignKey: 'attack_id',
        });
        this.belongsTo(models.Supporting_unit, {
            foreignKey: 'supporting_unit_id',
        });
    }

    /**
     * Other model operations
     */
}

module.exports = Attack_defenser_support;