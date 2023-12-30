'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const supportStatus = [
      {
        name: 'on the way',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'supporting',
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
      },
      {
        name: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    queryInterface.bulkInsert('support_status', supportStatus)
  },


  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('attack_status', null, {})
  }
};
