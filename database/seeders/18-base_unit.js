'use strict';

/** @type {import('sequelize-cli').Migration} */
const egiptian_infanteries = [
  {
    name: 'sphinx spearbearer',
    attack: 50,
    civilization_name: 'egyptian',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying_capacity: 20,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'scarab soldier',
    attack: 30,
    civilization_name: 'egyptian',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying_capacity: 25,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const greek_infanteries = [
  {
    name: 'spartan phalanx',
    attack: 40,
    civilization_name: 'greek',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying_capacity: 20,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'olympian legionnaire',
    attack: 32,
    civilization_name: 'greek',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying_capacity: 25,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const norse_infanteries = [
  {
    name: 'viking raider',
    attack: 15,
    civilization_name: 'norse',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying_capacity: 20,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'berserker',
    attack: 75,
    civilization_name: 'norse',
    unit_type: 'infantry',
    military_building: 'barrack',
    carrying_capacity: 25,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const egiptian_cavalries = [
  {
    name: 'anubis charger',
    attack: 60,
    civilization_name: 'egyptian',
    unit_type: 'cavalry',
    military_building: 'stable',
    carrying_capacity: 30,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'camel rider',
    attack: 40,
    civilization_name: 'egyptian',
    unit_type: 'cavalry',
    military_building: 'stable',
    carrying_capacity: 30,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const greek_cavalries = [
  {
    name: 'athena cavalier',
    attack: 45,
    civilization_name: 'greek',
    unit_type: 'cavalry',
    military_building: 'stable',
    carrying_capacity: 30,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'spartan steed',
    attack: 25,
    civilization_name: 'greek',
    unit_type: 'cavalry',
    military_building: 'stable',
    carrying_capacity: 30,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const norse_cavalries = [
  {
    name: 'ragnarok rider',
    attack: 40,
    civilization_name: 'norse',
    unit_type: 'cavalry',
    military_building: 'stable',
    carrying_capacity: 30,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'viking valkyries',
    attack: 48,
    civilization_name: 'norse',
    unit_type: 'cavalry',
    military_building: 'stable',
    carrying_capacity: 30,
    movement_speed: 10,
    population_cost: 1,
    training_time: 700,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.bulkInsert('unit', egiptian_infanteries, { hooks: false }),
      queryInterface.bulkInsert('unit', greek_infanteries, { hooks: false }),
      queryInterface.bulkInsert('unit', norse_infanteries, { hooks: false }),
      queryInterface.bulkInsert('unit', egiptian_cavalries, { hooks: false }),
      queryInterface.bulkInsert('unit', greek_cavalries, { hooks: false }),
      queryInterface.bulkInsert('unit', norse_cavalries, { hooks: false })
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unit', null, {});
  }
};
