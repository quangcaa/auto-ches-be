'use strict';

const { NOW } = require('sequelize');

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
      password: {
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      last_login: {
        type: Sequelize.DATE
      },
      games: {
        type: Sequelize.INTEGER
      },
      puzzles: {
        type: Sequelize.INTEGER
      },
      verification_code: {
        type: Sequelize.STRING
      },
      verification_code_expires_at: {
        type: Sequelize.DATE
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};