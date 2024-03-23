'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Defense_type model class
 */
class Defense_type extends Model {
    /**
     * Initializes the Defense_type model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            unit_name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'unit',
                    key: 'name'
                }
            },
            type: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: 'unit_type',
                    key: 'type'
                }
            },
            defense_value: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Defense_type',
            tableName: 'defense_type',
        });
    }

    /**
     * Initializes associations for the Defense_type model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        Defense_type.belongsTo(models.Unit, {
            foreignKey: 'unit_name',
        });
        Defense_type.belongsTo(models.Unit_type, {
            foreignKey: 'type',
        });
    }

    /**
     * Other model methods
     */
}

module.exports = Defense_type;