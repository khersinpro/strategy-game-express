'use strict';
const { faker } = require('@faker-js/faker');
const { Building, Civilization } = require('../index.js').models;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const civilizations = await Civilization.findAll();

    const infrastructure_building = await Building.findAll({
      where: {
        type: 'infrastructure_building'
      }
    });

    const military_building = await Building.findAll({
      where: {
        type: 'military_building'
      }
    });
    
    const resource_building = await Building.findAll({
      where: {
        type: 'resource_building'
      }
    });
    
    const wall_building = await Building.findAll({
      where: {
        type: 'wall_building'
      }
    });
    
    const special_building = await Building.findAll({
      where: {
        type: 'special_building'
      }
    });

    await queryInterface.bulkInsert('special_building', special_building.map(building => { 
      const civilization = civilizations[faker.number.int({ min: 0, max: civilizations.length - 1})];
      return {
        name: building.name,
        civilization_name: civilization.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    await queryInterface.bulkInsert('infrastructure_building', infrastructure_building.map(building => {
      return {      
        name: building.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    await queryInterface.bulkInsert('military_building', military_building.map(building => {
      let unit_type = 'infantry'
      building.name === 'stable' && (unit_type = 'cavalry')

      return {
        name: building.name,
        unit_type,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    await queryInterface.bulkInsert('resource_building', resource_building.map(building => {
      return {
        name: building.name,
        resource_name: building.name.split(' ')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    await queryInterface.bulkInsert('wall_building', wall_building.map(building => {
      const civilization = civilizations[faker.number.int({ min: 0, max: civilizations.length - 1 })];
      return {
        name: building.name,
        civilization_name: civilization.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specialized_building', null, {});
    await queryInterface.bulkDelete('infrastructure_building', null, {});
    await queryInterface.bulkDelete('military_building', null, {});
    await queryInterface.bulkDelete('resource_building', null, {});
    await queryInterface.bulkDelete('wall_building', null, {});
  }
};
