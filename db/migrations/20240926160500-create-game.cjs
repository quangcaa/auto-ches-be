'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      game_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      white_player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      black_player_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      start_time: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      end_time: {
        type: Sequelize.DATE
      },
      result: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      fen: {
        type: Sequelize.STRING,
        defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};