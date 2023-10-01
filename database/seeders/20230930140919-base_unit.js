'use strict';

/** @type {import('sequelize-cli').Migration} */
const egiptian_infanteries = [
  {
    name: 'sphinx spearbearer',
    atk: 50,
    civilization_type: 'egyptian',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'scarab soldier',
    atk: 30,
    civilization_type: 'egyptian',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const greek_infanteries = [
  {
    name: 'spartan phalanx',
    atk: 40,
    civilization_type: 'greek',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'olympian legionnaire',
    atk: 32,
    civilization_type: 'greek',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const norse_infanteries = [
  {
    name: 'viking raider',
    atk: 15,
    civilization_type: 'norse',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'berserker',
    atk: 75,
    civilization_type: 'norse',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const egiptian_cavalries = [
  {
    name: 'anubis charger',
    atk: 60,
    civilization_type: 'egyptian',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'camel rider',
    atk: 40,
    civilization_type: 'egyptian',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const greek_cavalries = [
  {
    name: 'athena cavalier',
    atk: 45,
    civilization_type: 'greek',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'spartan steed',
    atk: 25,
    civilization_type: 'greek',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const norse_cavalries = [
  {
    name: 'ragnarok rider',
    atk: 40,
    civilization_type: 'norse',
    unit_type: 'cavalry',
    military_building: 'Stable',
    carrying: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'viking valkyries',
    atk: 48,
    civilization_type: 'norse',
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
