const fs = require('fs');

const less = require('less');
const webpack = require('webpack');

exports.js = function(config) {
	return new Promise(function(resolve, reject) {
		const webpackCompiler = webpack(config);
		webpackCompiler.run(function(err, stats) {
			try {
				if (err) {
					reject(err);
				}
				else if (stats.compilation.errors && stats.compilation.errors.length) {
					reject(stats.compilation.errors);
				}
				else {
					resolve();
				}
			}
			catch (error) {
				reject(error);
			}
		});
	});
}

exports.test = function(config, callback) {
	const jest = require('jest');
	jest.runCLI(config, [config.rootDir]).then(function(success) {
		if (callback && typeof callback === 'function') {
			callback(success);
		}
	});
}
