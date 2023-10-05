'use strict';

/** @type {import('sequelize-cli').Migration} */

const civilizationList = [
  {
    name: "egyptian",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "greek",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "norse",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('civilization', civilizationList);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('civilization', null, {});
  }
};
