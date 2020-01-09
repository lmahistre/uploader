const fs = require('fs');
const path = require('path');
const os = require('os');

const chalk = require('chalk');
const express = require('express');
const formidable = require('formidable');
const notifier = require('node-notifier');

const config = require('./config');
const utils = require('./utils');

const rootFolder = path.resolve(__dirname+'/../..');
const homeDir = os.homedir();

module.exports = function(options) {
	const uploadDir = options.uploadFolder && path.resolve(options.uploadFolder) || path.join(homeDir, config.uploadFolder);

	const app = express();
	app.use(express.static(path.join(rootFolder, 'front')));

	app.get('/', function(req, res){
		res.sendFile(path.join(rootFolder, 'front/index.html'));
	});

	app.post('/upload', function(req, res){
		const form = new formidable.IncomingForm();
		const remoteIp = req.ip.split(':').pop();
		const files = [];

		form.maxFileSize = options.maxFileSize || config.maxFileSize;
		form.multiples = true;
		form.uploadDir = uploadDir;

		if (!fs.existsSync(form.uploadDir)) {
			fs.mkdirSync(form.uploadDir);
		}

		form.on('file', function(field, file) {
			clientFileName = file.name;
			serverFileName = clientFileName;
			while (fs.existsSync(path.join(form.uploadDir, serverFileName))) {
				serverFileName = utils.findNewName(serverFileName);
			}
			files.push({
				serverFileName,
				clientFileName,
			})
			fs.renameSync(file.path, path.join(uploadDir, serverFileName));
		});

		form.on('error', function(err) {
			console.log(chalk.red('An error has occured: \n' + err));
			res.status(403).json({
				error : err.message,
			});
		});

		form.on('end', function() {
			let msg = '';
			if (files.length > 1) {
				msg = files.length + ' files have been uploaded from ' + chalk.green(remoteIp) + ' :\n';
				for (let i=0; i<files.length; i++) {
					msg += chalk.green(files[i].serverFileName);
					if (files[i].serverFileName !== files[i].clientFileName) {
						msg += ' (original name: '+chalk.yellow(files[i].clientFileName)+')';
					}
					msg += '\n';
				}
			}
			else {
				msg = chalk.green(files[0].serverFileName) + ' has been uploaded from ' + chalk.green(remoteIp);
				if (files[0].clientFileName !== files[0].serverFileName) {
					msg += ' (original name: '+chalk.yellow(clientFileName)+')';
				}
			}

			res.json({
				success : 1,
			});

			if (options.notify && config.notify) {
				notifier.notify({
					title : files.length + ' file' + (files.length > 1 ? 's' : '') + ' uploaded',
					message : files.map(f => f.serverFileName).join('\n'),
					icon : path.join(rootFolder, 'front/favicon.png'),
				});
			}
		});

		form.parse(req);
	});

	const port = options.port && parseInt(options.port) || config.port;
	const server = app.listen(port, function() {
		console.log(chalk.green('Server listening on port ' + port + '\nUploads in folder: ' + uploadDir));
	});
}
