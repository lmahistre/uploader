const path = require('path');
const appDirName = path.resolve(__dirname+'/../..');

const resolve = relativePath => path.resolve(__dirname, '..', relativePath)

module.exports = {
	js : {
		mode: 'production',
		module: {
			rules: [
				{
					test: /\.jsx$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						// options: {
						// 	presets: ["env", "react"]
						// },
					},
				},
			],
		},
		entry : {
			app : appDirName+"/src/js/entry.js",
		},
		resolve : {
			extensions : ['.js', '.jsx',],
		},
		optimization : {
			minimize : false,
		},
		output : {
			path : appDirName +'/front',
			filename : '[name].js',
		},
	},
	css : {
		inputFolder : appDirName+'/src/less',
		inputFilename : 'entry.less',
		outputFolder : appDirName+'/front',
		outputFilename : 'style.css',
	},
	test : {
		rootDir : appDirName,
		testMatch : [
			'**/spec/**/?(*.)(spec|test).js?(x)',
		],
		verbose : false,
		transform: {
			"^.+\\.jsx?$": "babel-jest"
		},
	},
};