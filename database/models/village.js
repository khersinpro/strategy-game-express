'use strict';
const { Model } = require('sequelize');
const ForbiddenError = require('../../errors/forbidden');

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
      this.hasMany(models.Village_construction_progress, {
        foreignKey: {
          name: 'village_id'
        }
      })
    }

    // Other methods

    /**
     * Check if current user is owner of village or admin, if not throw error
     * @param {User} user
     * @throws {ForbiddenError} if the user is not the owner or admin
     * @returns {boolean} true if the user is the owner or admin
     */
    isAdminOrVillageOwner(user) {
      if (this.user_id !== user.id && user.role_name !== 'ROLE_ADMIN') 
      {
        throw new ForbiddenError(`You are not allowed to access this village`);
      }
      return true;
    }
  }
  
  Village.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
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

  /**
   * This hook is called before a village is finded and update the village resources
   */
  Village.addHook('beforeFind', async (options) => {
    const villageResourceService = require('../../api/village/village_resource/village_resource.service');
    const villageId = options.where.id;
    
    if (!villageId) {
      return;
    }
    
    await villageResourceService.updateVillageResource(villageId);
  })
  
  /**
   * This hook is called after a village is created and create all base village resources, buildings and units
   */
  Village.addHook('afterCreate', async (village, options) => {
    const models = require('../index').models;

    // Create resources building level 1
    const recource_buildings = await models.Building.findAll({
      include: [
        {
          model: models.Building_level,
          as: 'levels',
          where: {
            level: 1
          }
        }
      ],
      where: {
        type: 'resource_building',
      }
    })

    for (const resource_building of recource_buildings) {
      await models.Village_building.create({
        village_id: village.id,
        building_name: resource_building.name,
        building_level_id:resource_building.levels[0].id,
        type: resource_building.type
      })
    }

    // Create storage resource building level 1
    const storage_buildings = await models.Building.findAll({
      include: [
        {
          model: models.Building_level,
          as: 'levels',
          where: {
            level: 1
          }
        }
      ],
      where: {
        type: 'storage_building',
      }
    })
    for (const storage_building of storage_buildings) {
      await models.Village_building.create({
        village_id: village.id,
        building_name: storage_building.name,
        building_level_id: storage_building.levels[0].id,
        type: storage_building.type
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
    const headquarter_building = await models.Building.findOne({
      include: [
        {
          model: models.Building_level,
          as: 'levels',
          where: {
            level: 1
          }
        }
      ],
      where: {
        name: 'headquarters',
        type: 'infrastructure_building'
      }
    })

    await models.Village_building.create({
      village_id: village.id,
      building_name: headquarter_building.name,
      building_level_id: headquarter_building.levels[0].id,
      type: headquarter_building.type
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