'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Supporting_unit model class
 */
class Supporting_unit extends Model {
    /**
     * Initializes the Supporting_unit model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            support_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'support',
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
            },
            sent_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            present_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Supporting_unit',
            tableName: 'supporting_unit'
        });
    }

    /**
     * Initializes associations for the Supporting_unit model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Support, {
            foreignKey: 'support_id'
        })
        this.belongsTo(models.Village_unit, {
            foreignKey: 'village_unit_id'
        })
        this.hasMany(models.Attack_defenser_support, {
            foreignKey: 'supporting_unit_id'
        })
    }

    /**
     * Other model operations 
     */
}

module.exports = Supporting_unit;