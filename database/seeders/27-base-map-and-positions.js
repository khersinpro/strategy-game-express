'use strict';
const Server = require('../models/server');
const Map = require('../models/map');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {
    const servers = await Server.findAll();
    const maps = [];

    for (const server of servers)
    {
      const map = {
        x_area: 100,
        y_area: 100,
        server_name: server.name,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      maps.push(map);
    }

    await queryInterface.bulkInsert('map', maps);

    const generatedMaps = await Map.findAll();

    for (const map of generatedMaps)
    {
      await map.generateMapPositions();
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('map_position', null, {});
    await queryInterface.bulkDelete('map', null, {});
  }
};
