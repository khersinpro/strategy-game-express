'use strict';

/** @type {import('sequelize-cli').Migration} */
const egiptian_infanteries = [
  {
    name: 'Sphinx Spearbearer',
    civilization_type: 'Egyptians',
    unit_type: 'infantry',
    military_building: 'Barracks',
    carrying: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Scarab Soldier',
    civilization_type: 'Egyptians',
    unit_type: 'infantry',
    military_building: 'Barracks',
    carrying: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const greek_infanteries = [
  {
    name: 'Spartan Phalanx',
    civilization_type: 'Greeks',
    unit_type: 'infantry',
    military_building: 'Barracks',
    carrying: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Olympian Legionnaire',
    civilization_type: 'Greeks',
    unit_type: 'infantry',
    military_building: 'Barracks',
    carrying: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const norse_infanteries = [
  {
    name: 'Viking Raider',
    civilization_type: 'Norse',
    unit_type: 'infantry',
    military_building: 'Barracks',
    carrying: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Berserker',
    civilization_type: 'Norse',
    unit_type: 'infantry',
    military_building: 'Barracks',
    carrying: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const egiptian_cavalries = [
  {
    name: 'Anubis Charger',
    civilization_type: 'Egyptians',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Camel Rider',
    civilization_type: 'Egyptians',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const greek_cavalries = [
  {
    name: 'Athena Cavalier',
    civilization_type: 'Greeks',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Spartan Steed',
    civilization_type: 'Greeks',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const norse_cavalries = [
  {
    name: 'Ragnarok Rider',
    civilization_type: 'Norse',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Viking Valkyries',
    civilization_type: 'Norse',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('unit', egiptian_infanteries, {});
    await queryInterface.bulkInsert('unit', greek_infanteries, {});
    await queryInterface.bulkInsert('unit', norse_infanteries, {});
    await queryInterface.bulkInsert('unit', egiptian_cavalries, {});
    await queryInterface.bulkInsert('unit', greek_cavalries, {});
    await queryInterface.bulkInsert('unit', norse_cavalries, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unit', null, {});
  }
};
