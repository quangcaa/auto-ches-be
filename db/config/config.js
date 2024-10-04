require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_DATABASE,
    host: process.env.MYSQL_DB_HOST,
    port: process.env.MYSQL_DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 50,
      min: 10,
      acquire: 30000,
      idle: 10000,
    },
  },
};