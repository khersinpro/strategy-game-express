'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Attack_defenser_unit model class
 */
class Attack_defenser_unit extends Model {
    /**
     * Initializes the Attack_defenser_unit model
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
            },
            attack_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'attack',
                    key: 'id'
                }
            },
            village_unit_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'village_unit',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'Attack_defenser_unit',
            tableName: 'attack_defenser_unit',
            indexes: [
                // {
                //   unique: true,
                //   // fields: ['attack_id', 'village_unit_id']
                // }
            ]
        });
    }

    /**
     * Initializes associations for the Attack_defenser_unit model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Attack, {
            foreignKey: 'attack_id',
        });
        this.belongsTo(models.Village_unit, {
            foreignKey: 'village_unit_id',
        });
    }

    /**
     * Other model methods
     */
}

module.exports = Attack_defenser_unit;