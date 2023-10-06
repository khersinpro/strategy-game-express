'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Resource, Building_level } = require('../index.js').models;
const { faker } = require('@faker-js/faker');

module.exports = {
  async up (queryInterface, Sequelize) {
    const allBuildingLevels = await Building_level.findAll();
    const allResources = await Resource.findAll();

    const buildingCosts = allBuildingLevels.map(buildingLevel => {
      return allResources.map(resource => {
        return {
          quantity: faker.number.int({ min: 50, max: 150 }) * buildingLevel.level,
          resource_name: resource.name,
          building_level_id: buildingLevel.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }).flat()

    await queryInterface.bulkInsert('building_cost', buildingCosts);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('building_cost', null, {});
  }
};
