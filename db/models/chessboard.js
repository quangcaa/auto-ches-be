'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chessboard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chessboard.belongsTo(models.Game, { 
        as: 'chessboard_game_id_fk', 
        foreignKey: 'game_id',
        onUpdate: 'CASCASE',
        onDelete: 'CASCADE'
      });
    }
  }
  Chessboard.init({
    board_state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    move_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Chessboard',
    tableName: 'chessboards'
  });
  return Chessboard;
};