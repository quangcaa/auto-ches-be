'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Challenge.belongsTo(models.User, {
        as: 'Sender',
        foreignKey: 'sender_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // Association to Receiver (User)
      Challenge.belongsTo(models.User, {
        as: 'Receiver',
        foreignKey: 'receiver_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      // Association to Game
      Challenge.belongsTo(models.Game, {
        as: 'Game',
        foreignKey: 'game_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }
  Challenge.init({
    challenge_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'games',
        key: 'game_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'canceled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Challenge',
    tableName: 'challenges',
    timestamps: false
  });
  return Challenge;
};