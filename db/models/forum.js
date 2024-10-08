'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Forum.init({
    category_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    category_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    category_description: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Forum',
    tableName: 'forum',
    timestamps: false
  });
  return Forum;
};