'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_construction_progress extends Model {
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
    }
  }

  Village_construction_progress.init({
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
  
  return Village_construction_progress;
};