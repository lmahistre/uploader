const path = require('path');
const appDirName = path.resolve(__dirname+'/../..');

module.exports = {
	js : {
		mode: 'production',
		module: {
			rules: [
				{
					test: /\.jsx$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
					},
				},
				{
					test : /\.svg$/,
					use : [
						{
							loader : 'babel-loader',
						},
						{
							loader : 'react-svg-loader',
							options : {
								jsx : true,
							},
						},
					],
				},
			],
		},
		entry : {
			app : appDirName + '/src/entry.js',
			admin : appDirName + '/src/admin.js',
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
	test : {
		rootDir : appDirName,
		testMatch : [
			'**/test/**/?(*.)(spec|test).js?(x)',
		],
		verbose : false,
		transform: {
			'^.+\\.jsx?$': 'babel-jest',
		},
	},
	db : {
		sequelize : {
			dialect : 'sqlite',
			storage : 'fs.sqlite',
			operatorsAliases: false,
		},
		table : {
			freezeTableName: true,
			timestamps: false,
		},
	}
};
