'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Village_resource model class
 */
class Village_resource extends Model {
    /**
     * Initializes the Village_resource model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            quantity: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0
            },
            village_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'village',
                    key: 'id'
                }
            },
            resource_name: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'resource',
                    key: 'name'
                }
            }
        }, {
            indexes: [
                {
                    unique: true,
                    fields: ['village_id', 'resource_name']
                }
            ],
            sequelize,
            modelName: 'Village_resource',
            tableName: 'village_resource'
        });
    }

    /**
     * Initializes associations for the Village_resource model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Village, {
            foreignKey: 'village_id',
        });
        this.belongsTo(models.Resource, {
            foreignKey: 'resource_name',
        });
    }

    /**
     * Other methods
     */
}

module.exports = Village_resource;