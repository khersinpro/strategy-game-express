'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const resources = [
      {
        name: 'stone',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'wood',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'iron',
        createdAt: new Date(),
        updatedAt: new Date()        
      },
      {
        name: 'wheat', 
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await queryInterface.bulkInsert('resource', resources)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('resource', null, {});
  }
};
