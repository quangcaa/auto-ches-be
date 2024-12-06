'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Move extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Move.belongsTo(models.Game, { 
        as: 'game', 
        foreignKey: 'game_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Move.init({
    move_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    game_id: {
      type: DataTypes.STRING,
      references: {
        model: 'games',
        key: 'game_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    from: {
      type: DataTypes.STRING
    },
    to: {
      type: DataTypes.STRING
    },
    comments: {
      type: DataTypes.STRING
    },
    before: {
      type: DataTypes.STRING
    },
    after: {
      type: DataTypes.STRING
    },
    move_number: {
      type: DataTypes.INTEGER
    },
    san: {
      type: DataTypes.STRING
    },
    time_taken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Move',
    tableName: 'moves',
    timestamps: false
  });
  return Move;
};