const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const rootFolder = path.resolve(__dirname+'/..');

app.use(express.static(path.join(rootFolder, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(rootFolder, 'server/views/index.html'));
});


app.post('/upload', function(req, res){
	const form = new formidable.IncomingForm();

	// allow the user to upload multiple files in a single request
	form.multiples = true;
	form.uploadDir = path.join(rootFolder, '/uploads');
	if (!fs.existsSync(form.uploadDir)) {
		fs.mkdirSync(form.uploadDir);
	}

	form.maxFileSize = 2 * 1024 * 1024 * 1024;

	// rename file to its original name
	form.on('file', function(field, file) {
		fs.rename(file.path, path.join(form.uploadDir, file.name), function() {
			// fake callback to avoid warnings
		});
	});

	// log any errors
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {
		res.end('success');
	});

	// parse the incoming request containing the form data
	form.parse(req);
});


const server = app.listen(3004, function(){
	console.log('Server listening on port 3004');
});