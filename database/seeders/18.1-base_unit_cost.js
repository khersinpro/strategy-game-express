'use strict';
const Unit      = require('../models/unit');
const Resource  = require('../models/resource');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const AllUnits = await Unit.findAll();
    const allResources = await Resource.findAll();
    const allCostsArray = [];
    for (const uniqueUnit of AllUnits) {
      for (const uniqueResource of allResources) {
        const newCost = {
          unit_name: uniqueUnit.name,
          resource_name: uniqueResource.name,
          quantity: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        allCostsArray.push(newCost);
      }
    }

    await queryInterface.bulkInsert('unit_cost', allCostsArray);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unit_cost', null, {});
  }
};
