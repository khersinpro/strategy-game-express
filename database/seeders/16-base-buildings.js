'use strict';

const military_buildings = [
  {
    name: 'barrack',
    type: 'military_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'stable',
    type: 'military_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const resource_buildings = [
  {
    name: 'wood cutter',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'stone mine',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'iron mine',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'wheat fields',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const wall_building = [
  {
    name: 'greek wall',
    type: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'egyptian wall',
    type: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'norse wall',
    type: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const infrastructure_buildings = [
  {
    name: 'headquarters',
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'marketplace',
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'residence',
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "embassy",
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const special_buildings = [
  {
    name: 'greek Academy',
    type: 'special_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'egyptian Academy',
    type: 'special_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "norse Academy",
    type: 'special_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
]

const buildings = [
  ...military_buildings,
  ...resource_buildings,
  ...wall_building,
  ...infrastructure_buildings,
  ...special_buildings
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('building', buildings);
  },

  async down (queryInterface, Sequelize) {

  }
};