'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friendship.belongsTo(models.User, { 
        as: 'friendship_user_id_fk', 
        foreignKey: 'user_id',
        onUpdate: 'CASCASE',
        onDelete: 'CASCADE'
      });
      Friendship.belongsTo(models.User, { 
        as: 'friendship_friend_id_fk', 
        foreignKey: 'friend_id',
        onUpdate: 'CASCASE',
        onDelete: 'CASCADE'
      });
    }
  }
  Friendship.init({
    friendship_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    friend_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'blocked'),
      allowNull: false,
      defaultValue: 'pending'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Friendship',
    tableName: 'friendships',
  });
  return Friendship;
};