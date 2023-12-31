'use strict';
const { Model, Op } = require('sequelize');
const ForbiddenError = require('../../errors/forbidden');
const NotFoundError = require('../../errors/not-found');

module.exports = (sequelize, DataTypes) => {
  class Village extends Model {
    
    static associate(models) {
      // belongsTo association
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
      
      // hasMany association
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
      this.hasMany(models.Village_training_progress, {
        foreignKey: {
          name: 'village_id'
        }
      })
      this.hasMany(models.Attack, {
        foreignKey: {
          name: 'attacked_village_id',
          allowNull: false,
          as: 'defense'
        }
      })
      this.hasMany(models.Attack, {
        foreignKey: {
          name: 'attacking_village_id',
          allowNull: false,
          as: 'attack'
        }
      })
      this.hasMany(models.Village_support, {
        foreignKey: 'supporting_village_id',
        as: 'supporting_village'
      })
      this.hasMany(models.Village_support, {
        foreignKey: 'supported_village_id',
        as: 'supported_village'
      })

      //  Polimorphic association
      this.hasOne(models.Map_position, {
        foreignKey: 'target_entity_id',
        constraints: false,
        scope: {
          target_type: 'village'
        },
      });
    }

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

    /**
     * Find an emptu position into the map with parameters and add the village to it
     * @param {number} startX - search start x position
     * @param {number} endX - search end x position
     * @param {number} startY - search start y position
     * @param {number} endY  - search end y position
     */
    async addMapPosition (startX, endX, startY, endY) {
      try
      {
        if ((startX === 'undefined' || isNaN(startX)) || (endX  === 'undefined'|| isNaN(endX)) || (startY === 'undefined' || isNaN(startY)) || (endY === 'undefined' || isNaN(endY)) )
        {
          throw new Error('Invalid location')
        }
  
        const allEmptyPositions = await sequelize.models.Map_position.findAll({
          include: [
            {
              model: sequelize.models.Map,
              as: 'map',
              required: true,
              where: {
                server_name: this.server_name
              }
            }
          ],
          where: {
            x : { [Op.between]: [startX , endX]},
            y : { [Op.between]: [startY , endY]}, 
            target_type: 'empty',
            target_entity_id: null,
          }
        })
  
        if (!allEmptyPositions || allEmptyPositions.length === 0) 
        {
          throw new NotFoundError('No empty position found into this area')
        }

        const randomPosition            = allEmptyPositions[Math.floor(Math.random() * allEmptyPositions.length)]
        randomPosition.target_type      = 'village'
        randomPosition.target_entity_id = this.id
  
        await randomPosition.save()
      }
      catch (error)
      {
        throw error
      }
    }

    /**
     * Get the population capacity of the village
     * @throws {NotFoundError} if the town all building or the population capacity is not found
     * @return {Promise<Number></Number>} the population capacity of the village
     */
    async getPopulationCapacity () {
      try
      {
        const townAllBuilding = await sequelize.models.Village_building.findOne({
          attribute: ['building_level_id'],
          where: {
            village_id: this.id,
            type: 'town_all_building'
          }
        });

        if (!townAllBuilding)
        {
          throw new NotFoundError('Town all building not found')
        }

        const populationCapacity = await sequelize.models.Population_capacity.findOne({
          attribute: ['capacity'],
          where: {
            building_level_id: townAllBuilding.building_level_id
          }
        })

        if (!populationCapacity || populationCapacity.capacity === 'undefined' || isNaN(populationCapacity.capacity))
        {
          throw new NotFoundError('Population capacity not found')
        }

        return populationCapacity.capacity;
      }
      catch (error)
      { 
        throw error;
      }
    }

    /**
     * Get the actual population of village_unit for the village
     * @throws {NotFoundError} if the village_unit or the unit is not found
     * @return {Promise<Number>} the actual population of the village
     */
    async getPopulation () {
      try
      {
        const allVillageUnit = await sequelize.models.Village_unit.findAll({
          attribute: ['total_quantity'],
          include: [
            {
              model: sequelize.models.Unit,
              attribute: ['population_cost'],
              required: true
            }
          ],
          where: {
            village_id: this.id
          }
        })

        
        if (!allVillageUnit)
        {
          throw new NotFoundError('Village population not found')
        }

        let actualVillagePopulation = 0;

        for (const villageUnit of allVillageUnit) {
          actualVillagePopulation += villageUnit.total_quantity * villageUnit.Unit.population_cost
        }

        return actualVillagePopulation;
      }
      catch (error)
      {
        throw error;
      }
    }

    /**
     * Get the population in training of village_training_progress for the village
     * @return {Promise<Number>} the population in training of the village
     */ 
    async getPopulationInTraining () {
      try
      {
        const allVillageTrainingProgress = await sequelize.models.Village_training_progress.findAll({
          attribute: ['unit_to_train_count', 'trained_unit_count'],
          include: [
            {
              model: sequelize.models.Village_unit,
              attribute: ['id'],
              required: true,
              include: [
                {
                  model: sequelize.models.Unit,
                  attribute: ['population_cost'],
                  required: true
                }
              ]
            }
          ],
          where : {
            village_id: this.id,
            enabled: true,
            archived: false
          }
        })

        let populationInTraining = 0;

        if (allVillageTrainingProgress)
        {
          for (const villageTrainingProgress of allVillageTrainingProgress) {
            populationInTraining += (villageTrainingProgress.unit_to_train_count - villageTrainingProgress.trained_unit_count) * villageTrainingProgress.Village_unit.Unit.population_cost
          }
        }

        return populationInTraining;
      }
      catch (error)
      {
        throw error;
      }
    }

    /**
     * Check if the village has enough population to train the unit 
     * @param {Number} additionalPopulation - the population unit to add to the village population
     * @returns {Boolean} true if the village has enough population to train the unit or false if not 
     */
    async checkPopulationCapacity (additionalPopulation) {
      try
      {
        if (isNaN(additionalPopulation) || additionalPopulation < 0)
        {
          throw new Error('Invalid additional population')
        }

        // get population capacity, actual village population and population in training for the village
        const populationCapacity      = await this.getPopulationCapacity();
        const actualVillagePopulation = await this.getPopulation();
        const populationInTraining    = await this.getPopulationInTraining();
         
        // check if village has enough population capacity with boolean
        const enoughPopulationCapacity = populationCapacity >= actualVillagePopulation + populationInTraining + additionalPopulation;

        return enoughPopulationCapacity;
      }
      catch (error)
      {
        throw error
      }
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
            level: 7
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
            level: 7
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

    // Create town all building level 1
    const town_all_building = await models.Building.findOne({
      include: [
        {
          model: models.Building_level,
          as: 'levels',
          where: {
            level: 7
          }
        }
      ],
      where: {
        name: 'town all',
        type: 'town_all_building'
      }
    })

    await models.Village_building.create({
      village_id: village.id,
      building_name: town_all_building.name,
      building_level_id: town_all_building.levels[0].id,
      type: town_all_building.type
    })


    // Create wall building
    const wall_building = await models.Building.findOne({
      include: [
        {
          model: models.Building_level,
          as: 'levels',
          required: true,
          where: {
            level: 5
          }
        },
        {
          model: models.Wall_building,
          required: true,
          where: {
            civilization_name: village.civilization_name
          }
        }
      ],
      where: {
        type: 'wall_building'
      }
    })

    if (wall_building)
    {
      await models.Village_building.create({
        village_id: village.id,
        building_name: wall_building.name,
        building_level_id: wall_building.levels[0].id,
        type: wall_building.type
      })
    }


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
        total_quantity: 1000,
        present_quantity: 1000,
        in_attack_quantity: 0,
        in_support_quantity: 0,
      })
    }
  });
  
  return Village;
};