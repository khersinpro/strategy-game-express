"use strict";
const { Model, DataTypes } = require("sequelize");

/**
 * Attack_attacker_unit model class
 */
class Attack_attacker_unit extends Model {
    /**
     * Initializes the Attack_attacker_unit model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init(
            {
                attack_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "attack",
                        key: "id",
                    },
                },
                village_unit_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "village_unit",
                        key: "id",
                    },
                },
                sent_quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                lost_quantity: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                modelName: "Attack_attacker_unit",
                tableName: "attack_attacker_unit",
            },
            {
                uniqueKeys: {
                    unique_attack_attacker_unit: {
                        fields: ["attack_id", "village_unit_id"],
                    },
                },
            }
        );
    }

    /**
     * Initializes associations for the Attack_attacker_unit model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Attack, {
            foreignKey: "attack_id",
        });
        this.belongsTo(models.Village_unit, {
            foreignKey: "village_unit_id",
        });
    }

    /**
     * Other model operations
     */
}

module.exports = Attack_attacker_unit;