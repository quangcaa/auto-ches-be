'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      game_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      variant_id: {
        type: Sequelize.STRING,
        references: {
          model: 'variants',
          key: 'variant_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      time_control_id: {
        type: Sequelize.STRING,
        references: {
          model: 'timeControls',
          key: 'time_control_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rated: {
        type: Sequelize.BOOLEAN,
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
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      result: {
        type: Sequelize.ENUM,
        values: ['white_win', 'black_win', 'draw', 'abandoned']
      },
      pgn: {
        type: Sequelize.TEXT
      },
      move_number: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};