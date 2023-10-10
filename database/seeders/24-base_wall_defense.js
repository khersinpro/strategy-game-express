'use strict';
const { Building, Building_level } = require('../index').models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const wall_buildings = await Building.findAll({
      include: [
        {
          model: Building_level,
          as: 'levels'
        }
      ],
      where: {
        type: 'wall_building'
      }
    })

    const wall_defenses = wall_buildings.map(building => {
      return building.levels.map(level => {
        return {
          defense_percent: level.level * 3,
          wall_building_name: building.name,
          building_level_id: level.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    })

    await queryInterface.bulkInsert('wall_defense', wall_defenses.flat())
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
