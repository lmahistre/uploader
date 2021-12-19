const chalk = require('chalk');

const tasks = require('./build/tasks');
const utils = require('./app/utils');

exports.test = function () {
	tasks.test();
};

exports.build = function() {
	tasks.js();
};

exports.start = function(args) {
	const options = {};
	const port = args['--port'] || args['-p'];
	if (port) {
		options.port = port;
	}
	const uploadFolder = args['--upload-folder'] || args['-u'];
	if (uploadFolder) {
		options.uploadFolder = uploadFolder;
	}
	options.notify = !(args['--mute-notification'] || args['-n']);
	const maxFileSize = utils.readFileSize(args['--max-file-size'] || args['-m']);
	if (maxFileSize) {
		options.maxFileSize = maxFileSize;
	}
	require('./app/server')(options);
};

exports.default = function() {
	process.stdout.write('No action specified\n');
};

exports.error = function(error) {
	console.error(chalk.red(error));
};

exports.version = function() {
	const packageJson = require('../package.json');
	process.stdout.write(chalk.green('Version ' + packageJson.version) + '\n');
};

exports.createDb = function() {
	const folderModel = require('./models/folder');
	const uploadModel = require('./models/upload');
	folderModel.sync();
	uploadModel.sync();
};
