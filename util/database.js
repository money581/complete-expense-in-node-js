const Sequelize = require('sequelize');


const sequelize = new Sequelize( 'expense','root','Money$aman@12345',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;