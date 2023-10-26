const env = require('dotenv').config({path: __dirname + '/../.env'}).parsed;

if (!env)
{
    throw new Error('Environment file not found')
}

module.exports = {
    username: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE,
    host: env.HOST,
    port: env.DB_PORT,
    dialect: env.DIALECT
}