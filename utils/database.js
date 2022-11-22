const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('api', 'root','',{
    dialect: 'mysql',
    host: 'localhost'
})
module.exports = sequelize;




