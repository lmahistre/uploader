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

const ifaces = os.networkInterfaces();
const localIps = [];
for (let k in ifaces) {
	ifaces[k].map(function(interface) {
		if (interface.family === 'IPv4') {
			localIps.push(interface.address);
		}
	});
}

const isAdmin = function(req) {
	const remoteIp = req.ip.split(':').pop();
	return localIps.indeoxOf(remoteIp) > -1;
}

const isAdminMiddleware = function(req, res, next) {
  if (isAdmin(req)) {
    next();
  }
  else {
    res.status(400).json({
      error : 'Missing admin right',
    });
  }
}

module.exports = function(options) {
	const uploadDir = options.uploadFolder && path.resolve(options.uploadFolder) || path.join(homeDir, config.uploadFolder);
	const downloadRootFolder = path.join(rootFolder, config.downloadRoot);
	if (!fs.existsSync(downloadRootFolder)) {
		fs.mkdirSync(downloadRootFolder);
	}

	const app = express();
	app.use(express.static(path.join(rootFolder, 'front')));

	app.get('/', function(req, res) {
		const remoteIp = req.ip.split(':').pop();
		console.log(remoteIp)
		res.sendFile(__dirname+'/front.html');
	});

	app.post('/upload', function(req, res){
		const form = new formidable.IncomingForm();
		const remoteIp = req.ip.split(':').pop();
		const files = [];

		let clientFileName;
		let serverFileName;

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
			});
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
				msg = chalk.yellow(files[0].serverFileName) + ' has been uploaded from ' + chalk.green(remoteIp);
				if (files[0].clientFileName !== files[0].serverFileName) {
					msg += ' (original name: '+chalk.yellow(clientFileName)+')';
				}
			}

			console.log(msg);

			if (options.notify && config.notify) {
				notifier.notify({
					title : files.length + ' file' + (files.length > 1 ? 's' : '') + ' uploaded',
					message : files.map(f => f.serverFileName).join('\n'),
					icon : path.join(rootFolder, 'front/favicon.png'),
				});
			}

			res.json({
				success : 1,
			});
		});

		form.parse(req);
	});

	app.use('/file', express.static(downloadRootFolder));

	app.get('/getFileList', function(req, res) {
		// console.log(req)
		const queryDir = req.query && req.query.dir || '';
		const files = [];
		const folders = [];
		try {
			const absoluteDir = path.resolve(downloadRootFolder + queryDir);
			const dirContent = fs.readdirSync(absoluteDir);
			for (let i=0; i<dirContent.length; i++) {
				const filePath = path.join(absoluteDir, dirContent[i]);
				const file = {
					name : dirContent[i],
				};

				try {
					const stats = fs.statSync(filePath);
					file.isDir = stats.isDirectory();
					file.size = stats.size;
				}
				catch (error) {
					file.error = true;
				}
				if (file.isDir) {
					folders.push(file);
				}
				else {
					files.push(file);
				}
			}
			res.status(200).json({
				dir : queryDir || '',
				files : folders.concat(files),
			});
		}
		catch(error) {
			res.status(200).json({
				error : error.message,
			});
		}
	});

	const port = options.port && parseInt(options.port) || config.port;
	app.listen(port, function() {
		const ifaces = os.networkInterfaces();
		for (let k in ifaces) {
			ifaces[k].map(function(interface) {
				if (interface.family === 'IPv4') {
					console.log('Server running on ' + interface.address + ':' + port);
				}
			});
		}
		console.log('Uploads in folder: ' + chalk.green(uploadDir));
	});
};
