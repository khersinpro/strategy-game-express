'use strict';
const { Building, Building_level } = require('../index').models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const storage_buildings = await Building.findAll({
      include: [
        {
          model: Building_level, 
          as: 'levels'
        }
      ],
      where: {
        type: 'town_all_building'
      }
    })

    const populationCapacity = storage_buildings.map(building => {
      return building.levels.map(level => {
        return {
          capacity: level.level * 420,
          town_all_building_name: building.name,
          building_level_id: level.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }).flat()

    await queryInterface.bulkInsert('population_capacity', populationCapacity)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('population_capacity', null, {})
  }
};
