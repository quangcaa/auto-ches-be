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
      game_id: {
        type: Sequelize.STRING,
        references: {
          model: 'games',
          key: 'game_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      time_control_name: {
        type: Sequelize.ENUM('Bullet', 'Blitz', 'Rapid', 'Classical', 'Unlimited'),
      },
      base_time: {
        type: Sequelize.STRING
      },
      increment_by_turn: {
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timeControls');
  }
};