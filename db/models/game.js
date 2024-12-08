'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game.belongsTo(models.User, {
        as: 'whitePlayer',
        foreignKey: 'white_player_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
      Game.belongsTo(models.User, {
        as: 'blackPlayer',
        foreignKey: 'black_player_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
      Game.hasMany(models.Move, {
        as: 'moves',
        foreignKey: 'game_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Game.init({
    game_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    white_player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    black_player_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reason: {
      type: DataTypes.STRING
    },
    result: {
      type: DataTypes.STRING
    },
    wtime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    btime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
    },
    fen: {
      type: DataTypes.STRING,
      defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    },
    pgn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: false,
  });
  return Game;
};