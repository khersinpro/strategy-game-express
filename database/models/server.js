'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Server extends Model {

    static associate(models) {
      this.belongsToMany(models.User, {
        through: 'users_servers',
        foreignKey: 'server_name',
        otherKey: 'user_id'
      })
    }
  }

  Server.init({
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Server',
    tableName: 'server',
  });
  
  return Server;
};