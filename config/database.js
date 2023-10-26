const env = require('dotenv').config({path: __dirname + '/../.env'}).parsed;
console.log(env);
module.exports = {
    username: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
    host: env.HOST,
    port: env.DB_PORT,
    dialect: env.DIALECT
}