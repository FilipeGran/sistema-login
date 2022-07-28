const Sequelize = require('sequelize');

const connection = new Sequelize('sistema-login', 'root', '120719', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection;