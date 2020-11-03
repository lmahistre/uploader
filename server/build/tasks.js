const chalk = require('chalk');

const config = require('./config.js');
const compiler = require('./compiler.js');

exports.js = function() {
	return compiler.js(config.js).then(function() {
		console.log(chalk.green('JS successfully compiled'));
	}).catch(function(error) {
		console.log(chalk.red(error));
	});
};

exports.test = function() {
	const jest = require('jest');
	const options = config.test;
	return jest.runCLI(options, [options.rootDir]);
};
