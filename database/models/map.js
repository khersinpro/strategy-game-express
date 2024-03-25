'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Map model class
 */
class Map extends Model {
    /**
     * Initializes the Map model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            server_name: {
                type: DataTypes.STRING,
                allowNull: false,
                reference: {
                    model: 'serveur',
                    key: 'name'
                }
            },
            x_area: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            y_area: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        }, {
            sequelize,
            modelName: 'Map',
            tableName: 'map',
            indexes: [
                {
                    unique: true,
                    fields: ['server_name']
                }
            ]
        });

        this.setHooks();
    }

    /**
     * Initializes hooks for the Map model
     * @returns {void}
     */
    static setHooks() {
        this.afterCreate(async (map, options) => {
            try {
                await map.generateMapPositions();
            }
            catch (error) {
                throw error;
            }
        });
    }

    /**
     * Initializes associations for the Map model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Server, {
            foreignKey: {
                name: 'server_name',
                allowNull: false,
            }
        })
    }

    /**
     * Other model methods
     */

    /**
     * Generates map positions for the map
     */
    async generateMapPositions() {
        try {
            const x = this.x_area;
            const y = this.y_area;

            const positions = [];

            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    const position = {
                        x: i,
                        y: j,
                        map_id: this.id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    positions.push(position);
                }
            }

            const Map_position = this.sequelize.models.Map_position

            await Map_position.bulkCreate(positions);
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = Map;