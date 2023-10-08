'use strict';
const { Building, Building_level } = require('..').models
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const buildings = await  Building.findAll({
      where : {
        type: 'resource_building'
      },
      include: {
        model: Building_level,
        as: 'levels'
      }
    })

    const resource_productions = buildings.map(building => {
      return building.levels.map(level => {
        return {
          production: level.level * 5,
          resource_building_name: building.name,
          building_level_id: level.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    })

    await queryInterface.bulkInsert('resource_production', resource_productions.flat())
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('resource_production', null, {})
  }
};
