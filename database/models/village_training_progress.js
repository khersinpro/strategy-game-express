'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_training_progress extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'village_id'
      });
      this.belongsTo(models.Village_building, {
        foreignKey: 'village_building_id'
      });
      this.belongsTo(models.Village_unit, {
        foreignKey: 'village_unit_id'
      });
    }
  }

  Village_training_progress.init({
    training_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    training_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    unit_to_train_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    trained_unit_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    village_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    village_building_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village_building',
        key: 'id'
      }
    },
    village_unit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'village_unit',
        key: 'id'
      }
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
    }
  }, {
    sequelize,
    modelName: 'Village_training_progress',
    tableName: 'village_training_progress'
  });

  return Village_training_progress;
};