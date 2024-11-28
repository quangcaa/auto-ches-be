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
        as: 'game_white_player_id_fk',
        foreignKey: 'white_player_id',
        onUpdate: 'CASCASE',
        onDelete: 'CASCADE'
      });
      Game.belongsTo(models.User, {
        as: 'game_black_player_id_fk',
        foreignKey: 'black_player_id',
        onUpdate: 'CASCASE',
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
    type: {
      type: DataTypes.STRING,
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
      allowNull: false,
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
    end_time: {
      type: DataTypes.DATE,
    },
    result: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
    },
    fen: {
      type: DataTypes.STRING,
      defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    },
    strength: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: false,
  });
  return Game;
};