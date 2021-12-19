const fs = require('fs');
const path = require('path');
const os = require('os');

const bodyParser = require('body-parser');
const chalk = require('chalk');
const express = require('express');
const formidable = require('formidable');
const notifier = require('node-notifier');

const adminRouter = require('./admin-router');
const config = require('./config');
const utils = require('./utils');

const folderModel = require('../models/folder');

const rootFolder = path.resolve(__dirname+'/../..');
const homeDir = os.homedir();

const ifaces = os.networkInterfaces();
const localIps = [];
for (let k in ifaces) {
	ifaces[k].map(function(iface) {
		if (iface.family === 'IPv4') {
			localIps.push(iface.address);
		}
	});
}

const isAdmin = function(req) {
	const remoteIp = req.ip.split(':').pop();
	return localIps.indexOf(remoteIp) > -1;
};

const isAdminMiddleware = function(req, res, next) {
	if (isAdmin(req)) {
		next();
	}
	else {
		res.status(400).json({
			error : 'Missing admin right',
		});
	}
};

module.exports = function(options) {
	const uploadDir = options.uploadFolder && path.resolve(options.uploadFolder) || path.join(homeDir, config.uploadFolder);
	const downloadRootFolder = path.join(rootFolder, config.downloadRoot);
	if (!fs.existsSync(downloadRootFolder)) {
		fs.mkdirSync(downloadRootFolder);
	}

	const app = express();
	app.use(bodyParser.json());
	app.use(express.static(path.join(rootFolder, 'front')));

	app.get('/', function(req, res) {
		res.sendFile(__dirname+'/front.html');
	});

	app.get('/admin', function(req, res) {
		if (isAdmin(req)) {
			res.sendFile(__dirname+'/admin.html');
		}
		else {
			res.sendFile(__dirname+'/front.html');
		}
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
			process.stderr.write(chalk.red('An error has occured: \n' + err + '\n'));
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

			process.stdout.write(msg + '/n');

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

	// app.use('/file', express.static(downloadRootFolder));
	app.get('/file/:folderId/:filePath', function(req, res) {
		const folderId = req.params && req.params.folderId && parseInt(req.params.folderId);
		const { filePath } = req.params;

		if (typeof folderId === 'number' && folderId) {
			folderModel.findOne({
				where : {
					id : folderId,
				}
			}).then(function(result) {
				if (result && result.path) {
					const fullPath = result.path + '/' + filePath;
					if (fs.existsSync(fullPath)) {
						res.sendFile(fullPath);
					}
					else {
						return Promise.reject('File not found');
					}
				}
				else {
					return Promise.reject('Folder not found');
				}
			}).catch(function(error) {
				res.status(400).json({
					error : error && error.message || error,
				});
			});
		}
		else {
			res.status(400).json({
				error : 'Unknown folder',
			});
		}
	});

	app.get('/getFileList', function(req, res) {
		const folderId = req.query && req.query.folderId && parseInt(req.query.folderId);
		const queryDir = req.query && req.query.dir || '';
		const files = [];
		const folders = [];
		try {
			if (typeof folderId === 'number' && folderId) {
				folderModel.findOne({
					where : {
						id : folderId,
					}
				}).then(function(result) {
					const absoluteDir = path.resolve(result.path + queryDir);
					const dirContent = fs.readdirSync(absoluteDir);
					for (let i=0; i<dirContent.length; i++) {
						const filePath = path.join(absoluteDir, dirContent[i]);
						const file = {
							name : dirContent[i],
							isRoot : false,
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
						folderId : result.id,
						files : folders.concat(files),
					});
				}).catch(function(error) {
					res.status(400).json({
						error : error.message,
					});
				});
			}
			else {
				return folderModel.findAll().then(function(result) {
					for (let i=0; i<result.length; i++) {
						const file = {
							id : result[i].id,
							name : result[i].name,
							isDir : true,
							isRoot : true,
						};
						folders.push(file);
					}
					res.status(200).json({
						dir : '',
						files : folders,
					});
				});
			}
		}
		catch(error) {
			res.status(400).json({
				error : error.message,
			});
		}
	});

	app.use('/admin', isAdminMiddleware, adminRouter);

	const port = options.port && parseInt(options.port) || config.port;
	app.listen(port, function() {
		const ifaces = os.networkInterfaces();
		for (let k in ifaces) {
			ifaces[k].map(function(iface) {
				if (iface.family === 'IPv4') {
					process.stdout.write('Server running on ' + iface.address + ':' + port + '\n');
				}
			});
		}
		process.stdout.write('Uploads in folder: ' + chalk.green(uploadDir) + '\n');
	});
};
