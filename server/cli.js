const chalk = require('chalk');

const tasks = require('./build/tasks');
const utils = require('./app/utils');

exports.test = function (args) {
	tasks.test();
}

exports.build = function(args) {
	tasks.js();
}

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
}

exports.default = function() {
	console.log('No action specified');
}

exports.error = function(error) {
	console.log(chalk.red(error));
}

exports.version = function() {
	const package = require('../package.json');
	console.log(chalk.green('Version ' + package.version));
}
