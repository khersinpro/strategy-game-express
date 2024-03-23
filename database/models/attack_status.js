'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Attack_status model class
 */
class Attack_status extends Model {
    /**
     * Initializes the Attack_status model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, {
            sequelize,
            modelName: 'Attack_status',
            tableName: 'attack_status',
        });
    }

    /**
     * Initializes associations for the Attack_status model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.hasMany(models.Attack, {
            foreignKey: 'attack_status',
        });
    }

    /**
     * Other model methods
     */
}

module.exports = Attack_status;