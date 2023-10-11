'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_building extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'village_id',
      });
      this.belongsTo(models.Building, {
        foreignKey: 'building_name',
      });
    }
  }

  Village_building.init({
    village_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'village',
        key: 'id'
      }
    },
    building_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'building',
        key: 'name'
      }
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['village_id', 'building_name']
      }
    ],
    sequelize,
    modelName: 'Village_building',
    tableName: 'village_building',
  });

  return Village_building;
};