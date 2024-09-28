'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password_hash: {
        allowNull: false,
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      dob: {
        type: Sequelize.DATEONLY
      },
      country: {
        type: Sequelize.STRING
      },
      joined_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      last_login: {
        allowNull: false,
        type: Sequelize.DATE
      },
      games: {
        type: Sequelize.INTEGER
      },
      puzzles: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};