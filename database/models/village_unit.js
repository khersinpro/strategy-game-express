'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_unit extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'village_id',
      });
      this.belongsTo(models.Unit, {
        foreignKey: 'unit_name',
      });
    }
  }

  Village_unit.init({
    quantity: {
      type: DataTypes.INTEGER,
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
    unit_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'unit',
        key: 'name'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['village_id', 'unit_name']
      }
    ],
    sequelize,
    modelName: 'Village_unit',
    tableName: 'village_unit'
  });

  return Village_unit;
};