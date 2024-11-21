'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timeControls', {
      time_control_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      time_control_type: {
        type: Sequelize.ENUM('Bullet', 'Blitz', 'Rapid', 'Classical'),
      },
      initial: {
        type: Sequelize.STRING
      },
      increment: {
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timeControls');
  }
};