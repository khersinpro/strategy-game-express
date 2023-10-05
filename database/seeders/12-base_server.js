'use strict';

/** @type {import('sequelize-cli').Migration} */
const serverList = [
  {
    name: 'X-RAY',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'ZULU',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'YANKEE',
    createdAt: new Date(),
    updatedAt: new Date()
  },
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('server', serverList);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('server', null, {});
  }
};
