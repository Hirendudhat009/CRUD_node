const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'i am new..!'
    },
    // posts: [{
    //     type: Sequelize.DataTypes.ObjectId,
    //     ref: 'Post'
    // }]
})

module.exports = User;


















