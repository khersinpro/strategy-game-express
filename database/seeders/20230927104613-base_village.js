'use strict';
const { faker, fa } = require('@faker-js/faker');
const { User, Server, Village, Civilization } = require('../index.js').models;
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    // get all users
    const users = await User.findAll();
    // get all servers
    const servers = await Server.findAll();
    // get all civilizations
    const civilizations = await Civilization.findAll();

    // for each user, create a village and associate it with a random server
    for (const user of users) {
      const server = servers[faker.number.int({ min: 0, max: servers.length - 1 })];
      const civilization = civilizations[faker.number.int({ min: 0, max: civilizations.length - 1 })];

      const newVillage = new Village({
        name: 'Vilage of' + user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: user.id,
        civilization_type: civilization.type,
        server_name: server.name,
      });

      await user.addServer(server);

      await newVillage.save();
    } 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users_servers', null, {});
    await queryInterface.bulkDelete('village', null, {});
  }
};
