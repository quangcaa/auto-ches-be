'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'lucian123',
        email: 'lucian123123@gmail.com',
        password: '$2a$12$GlNz5zhGITKOqKuabV3FbOi3xWqx3gRmsUXnM4XhLmdvPeSRDDCwm',
        joined_date: new Date(),
        refresh_token: null,
        role: 'user'
      },
      {
        username: 'lucian234',
        email: 'lucian234234@gmail.com',
        password: '$2a$12$GlNz5zhGITKOqKuabV3FbOi3xWqx3gRmsUXnM4XhLmdvPeSRDDCwm',
        joined_date: new Date(),
        refresh_token: null,
        role: 'user'
      },
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: '$2a$12$GlNz5zhGITKOqKuabV3FbOi3xWqx3gRmsUXnM4XhLmdvPeSRDDCwm',
        joined_date: new Date(),
        refresh_token: null,
        role: 'admin'
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
