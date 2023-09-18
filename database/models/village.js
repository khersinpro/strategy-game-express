'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Village extends Model {
    static associate(models) {
      this.belongsTo(models.Server, {
        foreignKey: {
          name: 'server_name',
          allowNull: false,
        }
      })
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'user_id',
          allowNull: false,
        }
      })
    }
  }
  Village.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Village',
    tableName: 'village',
  });
  return Village;
};