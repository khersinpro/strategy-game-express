'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Support_status extends Model {
    static associate(models) {
      this.hasMany(models.Support, {
        foreignKey: 'status'
      })
    }
  }

  Support_status.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Support_status',
    tableName: 'support_status'
  });

  return Support_status;
};