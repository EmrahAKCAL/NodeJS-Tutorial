const {DataTypes} = require('sequelize');
const sequelize = require('../data/db');

const Course = sequelize.define('course', {
    // id: {
    //     type: DataTypes.INTEGER, // veri tipi
    //     primaryKey: true, // benzersiz bir değer
    //     autoIncrement: true, // otomatik artan
    //     allowNull: false // boş geçilemez
    // },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isPopular: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    // categoryId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false
    // }
}, {
    timestamps: true // created_at ve updated_at alanlarını ekler
});

module.exports = Course;
