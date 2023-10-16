'use strict';
const { Building, Building_level } = require('..').models

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const military_buildings = await Building.findAll({
      where : {
        type: 'military_building'
      },
      include: {
        model: Building_level,
        as: 'levels'
      }
    })

    const unit_productions = military_buildings.map(building => {
      return building.levels.map(level => {
        return {
          reduction_percent: level.level * 4,
          military_building_name: building.name,
          building_level_id: level.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    })

    await queryInterface.bulkInsert('unit_production', unit_productions.flat())
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unit_production', null, {})
  }
};
