'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('moves', {
      move_id: {
        allowNull: false,
        autoIncrement: true,
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
      move_number: {
        type: Sequelize.INTEGER
      },
      move_text: {
        type: Sequelize.STRING
      },
      player_color: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('moves');
  }
};