'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Variant.init({
    variant_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    variant_name: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Variant',
    tableName: 'variants',
    timestamps: false
  });
  return Variant;
};