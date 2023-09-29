'use strict';

const military_buildings = [
  {
    name: 'Barracks',
    type: 'military_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Stable',
    type: 'military_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const resource_buildings = [
  {
    name: 'Woodcutter',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Clay Pit',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Iron Mine',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cropland',
    type: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const wall_building = [
  {
    name: 'greeks_wall',
    type: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'egyptians_wall',
    type: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'norse_wall',
    type: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const infrastructure_buildings = [
  {
    name: 'Headquarters',
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Marketplace',
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Residence',
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Embassy",
    type: 'infrastructure_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const special_buildings = [
  {
    name: 'Greek Academy',
    type: 'special_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Egyptian Academy',
    type: 'special_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Norse Academy",
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
