'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Support extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'supported_village_id',
        as: 'supported_village'
      })
      this.belongsTo(models.Village, {
        foreignKey: 'supporting_village_id',
        as: 'supporting_village'
      })
      this.belongsTo(models.Support_status, {
        foreignKey: 'status'
      })
      this.hasMany(models.Supporting_unit, {
        foreignKey: 'support_id'
      })
    }
  }
  Support.init({
    supported_village_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    supporting_village_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village',
        key: 'key'
      }
    },
    arrival_date: {
      type: DataTypes.DATE,
    },
    return_date: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'support_status',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Support',
    tableName: 'support'
  });

  return Support;
};