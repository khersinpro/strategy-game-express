'use strict';

/** @type {import('sequelize-cli').Migration} */

const civilizationList = [
  {
    type: "egyptian",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "greek",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "norse",
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
