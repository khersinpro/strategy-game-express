'use strict';
const sequelize = require('../index').sequelize;

/** @type {import('sequelize-cli').Migration} */
const roles = [
  {
    name: 'ROLE_USER',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'ROLE_ADMIN',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role', roles);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
};
