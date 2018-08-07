
const config = require('./compiler-config.js');
const compiler = require('./compiler.js');

/**
 * Compile CSS
 */
exports.css = function(args) {
	compiler.css(config.css, function(error, success) {
		if (success) {
			console.log('CSS successfully compiled');
		}
		else {
			console.log(error);
		}
	});
}


/**
 * Compile JS
 */
exports.js = function(args) {
	config.js.mode = 'development';
	compiler.js(config.js, function(error, success) {
		if (success) {
			console.log('JS successfully compiled');
		}
		else {
			console.log(error);
		}
	});
}


exports.dev = function(args) {
	compiler.css(config.css, function(error, success) {
		if (success) {
			console.log('CSS successfully compiled');
		}
		else {
			console.log(error);
		}
		config.js.mode = 'development';
		compiler.js(config.js, function(error, success) {
			if (success) {
				console.log('JS successfully compiled');
			}
			else {
				console.log(error);
			}
		});
	});
}


exports.test = function (args) {
	const jest = require('jest');
	const path = require('path');
	const appDirName = path.resolve(__dirname+'/../src/spec');
	const options = config.test;
	const je = jest.runCLI(options, [options.rootDir]).then(function(success) {
	})
}


exports.build = function(args) {
	config.js.mode = 'production';
	compiler.js(config.js, function(error, success) {
		if (success) {
			console.log('JS successfully compiled');
		}
		else {
			console.log(error);
		}
		compiler.css(config.css, function(error, success) {
			if (success) {
				console.log('CSS successfully compiled');
			}
			else {
				console.log(error);
			}
			// exports.test();
		});
	});
}


exports.start = function(args) {
	require('./server.js');
}


exports.default = exports.build;