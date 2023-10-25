'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Village_resource extends Model {
    static associate(models) {
      this.belongsTo(models.Village, {
        foreignKey: 'village_id',
      });
      this.belongsTo(models.Resource, {
        foreignKey: 'resource_name',
      });
    }
  }

  Village_resource.init({
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

  return Village_resource;
};