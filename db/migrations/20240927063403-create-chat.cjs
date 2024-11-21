'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chats', {
      chat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      receiver_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      message: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('chats', ['sender_id']);
    await queryInterface.addIndex('chats', ['receiver_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chats');
  }
};