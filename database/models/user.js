'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')

/**
 * User model class
 */
class User extends Model {
    /**
     * Initializes the User model
     * @param {Sequelize} sequelize The sequelize object
     * @returns {void}
     */
    static initialize(sequelize) {
        this.init({
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
                    this.setDataValue('password', hash)
                }
            },
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'user',
        });
    }

    /**
     * Initializes associations for the User model
     * @param {Object} models The database models
     * @returns {void}
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
            otherKey: 'server_name',
            as: 'servers'
        })
        this.hasMany(models.Village, {
            foreignKey: 'user_id'
        })
    }

    /**
     * Other methods
     */

    /**
     * Check if the provided password is correct
     * @param {string} password The password to check
     * @returns {boolean} True if the password is correct, false otherwise
     */
    checkPassword(password) {
        return bcrypt.compareSync(password, this.password)
    }

    /**
     * Check if the user is an admin
     * @returns {boolean} True if the user is an admin, false otherwise
     */
    isAdmin() {
        return this.role_name === 'ROLE_ADMIN'
    }
}

module.exports = User;  