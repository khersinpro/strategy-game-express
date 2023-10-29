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
      this.belongsTo(models.Village_building, {
        foreignKey: {
          name: 'village_building_id',
          allowNull: false
        }
      })
    }
  }

  Village_construction_progress.init({
    type: {
      type: DataTypes.ENUM('construction', 'upgrade'),
      allowNull: false
    },
    construction_start: {
      type: DataTypes.DATE,
      allowNull: false  
    },
    constructon_end: {
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
    },
    village_building_id: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'village_building',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Village_construction_progress',
    tableName: 'vilage_construction_progress'
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