const tasks = require('./build/tasks');

exports.test = function (args) {
	tasks.test();
}

exports.build = function(args) {
	tasks.js().then(tasks.css);
}

exports.start = function(args) {
	require('./app/server');
}

exports.default = function() {
	console.log('No action specified');
}
