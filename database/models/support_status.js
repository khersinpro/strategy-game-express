'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Support_status model class
 */
class Support_status extends Model {
    /**
     * Initializes the Support_status model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'Support_status',
            tableName: 'support_status'
        });
    }

    /**
     * Initializes associations for the Support_status model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.hasMany(models.Support, {
            foreignKey: 'status'
        })
    }

    /**
     * Other methods
     */
}

module.exports = Support_status;