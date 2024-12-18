'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timecontrols', {
      time_control_id: {
      autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
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
        type: Sequelize.INTEGER
      },
      increment_by_turn: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('timecontrols');
  }
};