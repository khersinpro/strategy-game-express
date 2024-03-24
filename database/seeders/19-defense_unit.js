'use strict';
const Unit         = require('../models/unit');
const Defense_type = require('../models/defense_type');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const units = await Unit.findAll();

    for (const unit of units) {
      switch(unit.name) {
        case 'anubis charger':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 10,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 20,
            },
          ]);
          break;
        case 'camel rider':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 20,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 30,
            },
          ]);
          break;
        case 'scarab soldier':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 10,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 30,
            },
          ]);
          break;
        case 'sphinx spearbearer':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 50,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 10,
            },
          ]);
          break;
        case 'athena cavalier':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 30,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 15,
            },
          ]);
          break;
        case 'olympian legionnaire':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 22,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 30,
            },
          ]);
          break;
        case 'spartan phalanx':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 25,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 40,
            },
          ]);
          break;
        case 'spartan steed':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 31,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 20,
            },
          ]);
          break;
        case 'berserker':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 10,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 25,
            },
          ]);
          break;
        case 'ragnarok rider':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 30,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 10,
            },
          ]);
          break;
        case 'viking raider':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 10,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 10,
            },
          ]);
          break;
        case 'viking valkyries':
          await Defense_type.bulkCreate([
            {
              unit_name: unit.name,
              type: 'infantry',
              defense_value: 50,
            },
            {
              unit_name: unit.name,
              type: 'cavalry',
              defense_value: 0,
            },
          ]);
          break;
      }
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('defense_type', null, {});
  }
};
