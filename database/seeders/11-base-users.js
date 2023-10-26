'use strict';
const {faker} = require('@faker-js/faker');
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
const users = [...Array(2000)].map((user, idx) => {
  let salt = bcrypt.genSaltSync(12)
  let hash = bcrypt.hashSync(faker.internet.password(), salt)
  return {
    username: faker.person.firstName() + idx,
    email: idx + faker.internet.email(),
    password: hash,
    role_name: 'ROLE_USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

let salt = bcrypt.genSaltSync(12)
let hash = bcrypt.hashSync('admin', salt)
users.push({
  username: 'admin',
  email: 'admin@admin.fr',
  password: hash,
  role_name: 'ROLE_ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
})
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user', users);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
