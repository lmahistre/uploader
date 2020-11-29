const Sequelize = require('sequelize');
const config = require('../build/config');
const sequelize = new Sequelize(config.db.sequelize);

module.exports = sequelize.define('folder', {
	name : Sequelize.STRING,
	path : Sequelize.STRING,
	time_created : Sequelize.INTEGER,
	openToUpload : {
		type : Sequelize.BOOLEAN,
		defaultValue : 0,
	},
	openToDownload : {
		type : Sequelize.BOOLEAN,
		defaultValue : 0,
	},
}, config.db.table);
