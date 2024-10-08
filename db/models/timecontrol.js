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
    }
  }
  TimeControl.init({
    time_control_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    time_control_type: {
      type: DataTypes.STRING
    },
    minutes_per_side: {
      type: DataTypes.STRING
    },
    increment_in_seconds: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'TimeControl',
    tableName: 'timeControls',
    timestamps: false
  });
  return TimeControl;
};