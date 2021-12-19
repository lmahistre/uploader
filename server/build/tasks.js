const chalk = require('chalk');

const config = require('./config.js');
const compiler = require('./compiler.js');

exports.js = function() {
	return compiler.js(config.js).then(function() {
		process.stdout.write(chalk.green('JS successfully compiled')+'\n');
	}).catch(function(error) {
		console.error(chalk.red(error));
	});
};

exports.test = function() {
	const jest = require('jest');
	const options = config.test;
	return jest.runCLI(options, [options.rootDir]);
};
