require('dotenv').config()
const env = process.env

module.exports = {
    username: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
    host: env.HOST,
    port: env.PORT,
    dialect: env.DIALECT
}