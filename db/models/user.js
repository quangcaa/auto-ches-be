'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    profile_picture: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    country: {
      type: DataTypes.STRING,
    },
    joined_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    games: {
      type: DataTypes.INTEGER,
    },
    puzzles: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};