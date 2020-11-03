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
};

exports.test = function(config) {
	const jest = require('jest');
	return jest.runCLI(config, [config.rootDir]);
};
