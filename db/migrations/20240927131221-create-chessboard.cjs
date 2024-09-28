'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chessboards', {
      board_state_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      game_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'games',
          key: 'game_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      move_number: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fen: {
        type: Sequelize.STRING
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chessboards');
  }
};