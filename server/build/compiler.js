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

exports.css =  function(config, callback) {
	const less = require('less');
	return new Promise(function(resolve, reject) {
		try {
			fs.readFile(config.inputFolder+'/'+config.inputFilename, { 
				encoding: 'utf8' 
			}, 
			function(err, data) {
				if (err) {
					reject(err);
				}
				less.render(data, {
					paths: [config.inputFolder+'/'],
					filename: './'+config.inputFilename,
					compress: false,
				},
				function (e, output) {
					if (e) {
						reject(e);
					}
					else {
						fs.writeFile(config.outputFolder+'/'+config.outputFilename, output.css, {
							flag:'w+', 
							encoding:'utf8'
						},
						function(err, stg) {
							if (err) {
								reject(err);
							}
							else {
								resolve();
							}
						});
					}
				});
			});
		}
		catch(err) {
			reject(err);
		}
	});
};

exports.test = function(config, callback) {
	const jest = require('jest');
	jest.runCLI(config, [config.rootDir]).then(function(success) {
		if (callback && typeof callback === 'function') {
			callback(success);
		}
	});
}
