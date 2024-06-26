'use strict';
const { faker }     = require('@faker-js/faker');
const Building      = require('../models/building');
const Civilization  = require('../models/civilization');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const civilizations = await Civilization.findAll();

    const infrastructure_building = await Building.findAll({
      where: {
        type: 'town_all_building'
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
    
    const storage_building = await Building.findAll({
      where: {
        type: 'storage_building'
      }
    });

    await queryInterface.bulkInsert('special_building', special_building.map((building, index) => { 
      const civilization = civilizations[index];
      return {
        name: building.name,
        civilization_name: civilization.name,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    await queryInterface.bulkInsert('town_all_building', infrastructure_building.map(building => {
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

    await queryInterface.bulkInsert('storage_building', storage_building.map(building => {
      return {
        name: building.name,
        resource_name: building.name.split(' ')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }))

    const wall_bulding_inherit = wall_building.map(building => {
      return {
        name: building.name,
        civilization_name: building.name.split(' ')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert('wall_building', wall_bulding_inherit )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('specialized_building', null, {});
    await queryInterface.bulkDelete('town_all_building', null, {});
    await queryInterface.bulkDelete('military_building', null, {});
    await queryInterface.bulkDelete('resource_building', null, {});
    await queryInterface.bulkDelete('wall_building', null, {});
  }
};
