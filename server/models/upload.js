const Sequelize = require('sequelize');
const config = require('../build/compiler-config');
const sequelize = new Sequelize(config.db.sequelize);

module.exports = sequelize.define('upload', {
	originalName : Sequelize.STRING,
	finalName : Sequelize.STRING,
	time_completed : Sequelize.INTEGER,
	ipAddress : Sequelize.STRING,
	rootFolder : Sequelize.STRING,
	folder : Sequelize.STRING,
}, config.db.table);
