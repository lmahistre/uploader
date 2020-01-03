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
	let clientFileName, serverFileName;
	const remoteIp = req.ip.split(':').pop();

	// allow the user to upload multiple files in a single request
	form.maxFileSize = config.maxFileSize;
	form.multiples = true;
	form.uploadDir = uploadDir;

	if (!fs.existsSync(form.uploadDir)) {
		fs.mkdirSync(form.uploadDir);
	}

	// rename file to its original name
	form.on('file', function(field, file) {
		clientFileName = file.name;
		serverFileName = clientFileName;
		while (fs.existsSync(path.join(form.uploadDir, serverFileName))) {
			serverFileName = utils.findNewName(serverFileName);
		}
		fs.renameSync(file.path, path.join(uploadDir, serverFileName));
	});

	// log any errors
	form.on('error', function(err) {
		console.log(chalk.red('An error has occured: \n' + err));
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {
		console.log(chalk.green(serverFileName) + ' has been uploaded from ' + chalk.green(remoteIp) + (clientFileName !== serverFileName ? ' (original name: '+chalk.yellow(clientFileName)+')' : '') );
		res.end('success');
	});

	form.parse(req);
});

const server = app.listen(config.port, function(){
	console.log(chalk.green('Server listening on port ' + config.port));
});
