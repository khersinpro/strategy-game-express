'use strict';
const bcrypt = require('bcrypt')
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
      this.belongsTo(models.Role, {
        foreignKey: {
          name: 'role_name',
          allowNull: false,
          defaultValue: 'ROLE_USER'
        }
      })
      this.belongsToMany(models.Server, {
        through: 'users_servers',
        foreignKey: 'user_id',
        otherKey: 'server_name'
      })
      this.hasMany(models.Village, {
        foreignKey: 'user_id'
      })
    }

    checkPassword(password) {
      return bcrypt.compareSync(password, this.password)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 20]
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255), 
      allowNull: false,
      validate: {
        len: [8, 255]
      },
      set(value) {
        let salt = bcrypt.genSaltSync(12)
        let hash = bcrypt.hashSync(value, salt)
        this.setDataValue('password', hash )
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
  });
  return User;
};