'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Server extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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