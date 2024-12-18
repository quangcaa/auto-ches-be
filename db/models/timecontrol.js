'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeControl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TimeControl.belongsTo(models.Game, {
        as: 'Game',
        foreignKey: 'game_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  TimeControl.init({
    time_control_id: {
      autoIncrement: true,
      allowNull: false,
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
    time_control_name: {
      type: DataTypes.ENUM('Bullet', 'Blitz', 'Rapid', 'Classical', 'Unlimited'),
    },
    base_time: {
      type: DataTypes.INTEGER
    },
    increment_by_turn: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'TimeControl',
    tableName: 'timecontrols',
    timestamps: false
  });
  return TimeControl;
};