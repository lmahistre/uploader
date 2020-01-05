const fs = require('fs');
const path = require('path');
const os = require('os');

const chalk = require('chalk');
const express = require('express');
const formidable = require('formidable');

const config = require('./config');
const utils = require('./utils');

const rootFolder = path.resolve(__dirname+'/../..');
const homeDir = os.homedir();
const uploadDir = path.join(homeDir, config.uploadFolder);

const app = express();
app.use(express.static(path.join(rootFolder, 'front')));

app.get('/', function(req, res){
	res.sendFile(path.join(rootFolder, 'front/index.html'));
});

app.post('/upload', function(req, res){
	const form = new formidable.IncomingForm();
	const remoteIp = req.ip.split(':').pop();
	const files = [];

	form.maxFileSize = config.maxFileSize;
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
		console.log(msg);
		res.end('success');
	});

	form.parse(req);
});

const server = app.listen(config.port, function(){
	console.log(chalk.green('Server listening on port ' + config.port));
});
