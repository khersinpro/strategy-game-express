'use strict';
const { Model, DataTypes } = require('sequelize');

/**
 * Village_construction_progress model class
 */
class Village_construction_progress extends Model {
    /**
     * Initializes the Village_construction_progress model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
            type: {
                type: DataTypes.ENUM('village_new_construction', 'village_update_construction'),
                allowNull: false
            },
            construction_start: {
                type: DataTypes.DATE,
                allowNull: false
            },
            construction_end: {
                type: DataTypes.DATE,
                allowNull: false
            },
            enabled: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            archived: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            village_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'village',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'Village_construction_progress',
            tableName: 'village_construction_progress'
        });
    }

    /**
     * Initializes associations for the Village_construction_progress model
     * @param {Object} models The database models
     * @returns {void}
     */
    static associate(models) {
        this.belongsTo(models.Village, {
            foreignKey: {
                name: 'village_id',
                allowNull: false
            }
        })
        this.hasOne(models.Village_new_construction, {
            foreignKey: {
                name: 'id',
            }
        })
        this.hasOne(models.Village_update_construction, {
            foreignKey: {
                name: 'id',
            }
        })
    }

    /**
     *  Other methods
     */

    /**
     * Get the herited association of the construction progress
     * @returns {Promise<Village_update_construction | Village_new_construction>} The herited construction progress
     */
    async getHeritedConstructionProgress() {
        if (this.type === 'village_new_construction') {
            return this.getVillage_new_construction();
        }
        else if (this.type === 'village_update_construction') {
            return this.getVillage_update_construction();
        }
    }
}


/**
 * Before creating a new construction progress, check if there are already 3 constructions in progress
 */
Village_construction_progress.beforeCreate(async (village_construction_progress, options) => {
    const constructionsInProgress = await Village_construction_progress.count({
        where: {
            village_id: village_construction_progress.village_id,
            enabled: true,
            archived: false
        }
    });

    if (constructionsInProgress >= 3) {
        throw new Error('Maximum number of constructions in progress reached');
    }
});

module.exports = Village_construction_progress;