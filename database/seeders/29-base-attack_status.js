'use strict';

const { QueryInterface } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const attackStatus = [
      {
        name: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'attacking',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'lost',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'returning',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'returned',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    queryInterface.bulkInsert('attack_status', attackStatus)
  },


  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('attack_status', null, {})
  }
};
