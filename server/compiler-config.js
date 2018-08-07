const path = require('path');
const appDirName = path.resolve(__dirname+'/..');

const resolve = relativePath => path.resolve(__dirname, '..', relativePath)

module.exports = {
	js : {
		// mode: 'development',
		// module: {
		// 	rules: [
		// 		{
		// 			test: /\.jsx$/,
		// 			exclude: /node_modules/,
		// 			use: {
		// 				loader: "babel-loader",
		// 				options: {
		// 					presets: ["env", "react"]
		// 				},
		// 			},
		// 		},
		// 	],
		// },
		entry : appDirName+"/src/js/entry.js",
		output : {
			path : appDirName +'/public',
			filename : 'bundle.js',
		}
	},
	css : {
		inputFolder : appDirName+'/src/less',
		inputFilename : 'entry.less',
		outputFolder : appDirName+'/public',
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