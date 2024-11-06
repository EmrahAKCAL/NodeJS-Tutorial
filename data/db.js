const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false,
    define: {
        // freezeTableName: true,  // tablo isimlerini çoğul yapmaz
        timestamps: false, // created_at ve updated_at alanlarını oluşturmaz
    }
});
module.exports = sequelize;
