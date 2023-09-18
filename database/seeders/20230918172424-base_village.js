'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id from user;`
    );

    const servers = await queryInterface.sequelize.query(
      `SELECT name from server;`
    );

    // insert a random server for each user
    users.forEach(async user => {
      await queryInterface.insert('users_servers', {
        user_id: user.id,
        server_name: servers[faker.number.int({min: 0, max: servers.length - 1})].name,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })
        
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
