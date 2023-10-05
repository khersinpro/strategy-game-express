'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Resource extends Model {

    static associate(models) {

    }
  }

  Resource.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Resource',
    tableName: 'resource'
  });
  
  return Resource;
};