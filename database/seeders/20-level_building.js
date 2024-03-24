'use strict';
const Building = require('../models/building');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const buildings = await Building.findAll();
    for (const building of buildings) {
      const levels = [...Array(10)].map((level, index) => {
        return {
          level: index + 1,
          building_name: building.name,
          time: 600  * (index + 1),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      await queryInterface.bulkInsert('building_level', levels);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('building_level', null, {});
  }
};
