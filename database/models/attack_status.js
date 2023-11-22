'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attack_status extends Model {
    static associate(models) {
      this.hasMany(models.Attack, {
        foreignKey: 'attack_status',
      });
    }
  }

  Attack_status.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Attack_status',
    tableName: 'attack_status',
  });

  return Attack_status;
};