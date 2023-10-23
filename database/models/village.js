'use strict';
const { Model } = require('sequelize');

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
      }),
      this.belongsTo(models.Civilization, {
        foreignKey: {
          name: 'civilization_name',
          allowNull: false,
        }
      })
      this.hasMany(models.Village_building, {
        foreignKey: {
          name: 'village_id'
        }
      })
      this.hasMany(models.Village_unit, {
        foreignKey: {
          name: 'village_id'
        }
      })
      this.hasMany(models.Village_resource, {
        foreignKey: {
          name: 'village_id'
        }
      })
    }
  }
  
  Village.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    civilization_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'civilization',
        key: 'name'
      }
    },
  }, {
    sequelize,
    modelName: 'Village',
    tableName: 'village',
  });
  
  Village.addHook('afterCreate', async (village, options) => {
    const models = require('../index').models;
    
    // Create resources building level 1
    const recource_buildings = await models.Resource_building.findAll()
    for (const resource_building of recource_buildings) {
      await models.Village_building.create({
        village_id: village.id,
        building_name: resource_building.name,
        level: 1,
      })
    }

    // Create storage resource building level 1
    const storage_buildings = await models.Storage_building.findAll()
    for (const storage_building of storage_buildings) {
      await models.Village_building.create({
        village_id: village.id,
        building_name: storage_building.name,
        level: 1,
      })
    }

    // Create village resources with starting quantity
    const resources = await models.Resource.findAll()
    for (const resource of resources) {
      await models.Village_resource.create({
        village_id: village.id,
        resource_name: resource.name,
        quantity: 300,
      })
    }


    // Create headquarters building level 1
    const headquarter_building = await models.Infrastructure_building.findOne({
      where: {
        name: 'headquarters'
      }
    })
    await models.Village_building.create({
      village_id: village.id,
      building_name: headquarter_building.name,
      level: 1,
    })

    // Create all units of village resource with quantity 0
    const units = await models.Unit.findAll({
      where: {
        civilization_name: village.civilization_name
      }
    })
    for (const unit of units)  {
      await models.Village_unit.create({
        village_id: village.id,
        unit_name: unit.name,
        quantity: 0,
      })
    }
  });
  
  return Village;
};