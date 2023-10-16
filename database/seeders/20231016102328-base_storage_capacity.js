'use strict';
const { Building, Building_level } = require('../index').models;
const { Storage_building } = require('../index').models

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
        type: 'storage_building'
      }
    })

    const storage_capacity = storage_buildings.map(building => {
      return building.levels.map(level => {
        return {
          capacity: level.level * 420,
          storage_building_name: building.name,
          building_level_id: level.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }).flat()

    await queryInterface.bulkInsert('storage_capacity', storage_capacity)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('storage_capacity', null, {})
  }
};
