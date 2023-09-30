'use strict';

/** @type {import('sequelize-cli').Migration} */
const unit_type = [
  {
    type: 'infantry',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'cavalry',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // {
  //   type: 'siege',
  //   createdAt: new Date(),
  //   updatedAt: new Date()
  // },
  // {
  //   type: 'ship',
  //   createdAt: new Date(),
  //   updatedAt: new Date()
  // },
  // {
  //   type: 'special',
  //   createdAt: new Date(),
  //   updatedAt: new Date()
  // }           
]
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('unit_type', unit_type, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('unit_type', null, {});
  }
};
