'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Village_unit model class
 */
class Village_unit extends Model {
    /**
     * Initializes the Village_unit model
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
            unit_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'unit',
                    key: 'name'
                }
            },
            total_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            present_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            in_attack_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            in_support_quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['village_id', 'unit_name']
                }
            ],
            sequelize,
            modelName: 'Village_unit',
            tableName: 'village_unit'
        });
    }

    /**
     * Initializes associations for the Village_unit model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Village, {
            foreignKey: 'village_id',
        });
        this.belongsTo(models.Unit, {
            foreignKey: 'unit_name',
        });
        this.hasMany(models.Attack_attacker_unit, {
            foreignKey: 'village_unit_id',
        });
        this.hasMany(models.Attack_defenser_unit, {
            foreignKey: 'village_unit_id',
        });
    }

    /**
     * Other methods
     */
}

module.exports = Village_unit;