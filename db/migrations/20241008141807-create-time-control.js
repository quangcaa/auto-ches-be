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
        type: Sequelize.STRING
      },
      minutes_per_side: {
        type: Sequelize.STRING
      },
      increment_in_seconds: {
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timeControls');
  }
};