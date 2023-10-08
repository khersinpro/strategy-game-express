'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {

    static associate(models) {
      this.hasMany(models.User, {
        foreignKey: 'role_name'
      })
    }
  }

  Role.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'role',
  });
  
  return Role;
};