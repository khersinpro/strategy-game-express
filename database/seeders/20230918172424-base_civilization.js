'use strict';

/** @type {import('sequelize-cli').Migration} */

const civilizationList = [
  {
    type: "Egyptians",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "Greeks",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    type: "Norse",
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
