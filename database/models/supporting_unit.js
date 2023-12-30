'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supporting_unit extends Model {
    static associate(models) {
      this.belongsTo(models.Support, {
        foreignKey: 'support_id'
      })
      this.belongsTo(models.Village_unit, {
        foreignKey: 'village_unit_id'
      })
    }
  }

  Supporting_unit.init({
    support_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'support',
        key: 'id'
      }
  },
    village_unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: 'village_unit',
        key: 'id'
      }
  },
    sent_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
    present_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
  }
  }, {
    sequelize,
    modelName: 'Supporting_unit',
    tableName: 'supporting_unit'
  });

  return Supporting_unit;
};