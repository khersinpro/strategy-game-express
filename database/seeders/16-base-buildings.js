'use strict';

const base_building_types  = [
  {
    name: 'military_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'resource_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'wall_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'town_all_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'special_building',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'storage_building',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const military_buildings = [
  {
    name: 'barrack',
    type: 'military_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'stable',
    type: 'military_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const resource_buildings = [
  {
    name: 'wood cutter',
    type: 'resource_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'stone mine',
    type: 'resource_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'iron mine',
    type: 'resource_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'wheat fields',
    type: 'resource_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const wall_building = [
  {
    name: 'greek wall',
    type: 'wall_building',
    is_common: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'egyptian wall',
    type: 'wall_building',
    is_common: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'norse wall',
    type: 'wall_building',
    is_common: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const town_all_building = [
  {
    name: 'town all',
    type: 'town_all_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
]

const special_buildings = [
  {
    name: 'greek Academy',
    type: 'special_building',
    is_common: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'egyptian Academy',
    type: 'special_building',
    is_common: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "norse Academy",
    type: 'special_building',
    is_common: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
]

const storage_building = [
  {
    name: 'wood storage',
    type: 'storage_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'stone storage',
    type: 'storage_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'iron storage',
    type: 'storage_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'wheat storage',
    type: 'storage_building',
    is_common: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const buildings = [
  ...military_buildings,
  ...resource_buildings,
  ...wall_building,
  ...town_all_building,
  ...special_buildings,
  ...storage_building
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('building_type', base_building_types);
    await queryInterface.bulkInsert('building', buildings);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('building_type', base_building_types);
    await queryInterface.bulkDelete('building', buildings);
  }
};
