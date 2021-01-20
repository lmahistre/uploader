const fs = require('fs');
const os = require('os');
const path = require('path');

const express = require('express');
const router = express.Router();

const folderModel = require('../models/folder');

router.get('/getFolders', function(req, res) {
	folderModel.findAll().then(function(result) {
		res.json(result);
	}).catch(function(error) {
		console.error(error);
		res.status(400).json({
			error : error.message,
		});
	});
});

router.get('/getFolderContent', function(req, res) {
	const queryDir = req.query && req.query.dir || os.homedir();
	const files = [];
	const folders = [];
	try {
		const absoluteDir = path.resolve(queryDir);
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

router.post('/addFolder', function(req, res) {
	const dirNameParts = req.body.dir.split('/');
	const dirName = dirNameParts[dirNameParts.length - 1];

	folderModel.create({
		name : dirName,
		path : req.body.dir,
		openToDownload : true,
	}).then(function(data) {
		res.json(data);
	}).catch(function(error) {
		res.status(400).json({
			error : error.message,
		});
	});
});

module.exports = router;
