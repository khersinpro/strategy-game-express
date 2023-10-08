'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users_servers extends Model {
    
    static associate(models) {

    }
  }
  users_servers.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    server_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'server',
        key: 'name'
      }
    }
  }, {
    sequelize,
    modelName: 'users_servers',
  });
  
  return users_servers;
};