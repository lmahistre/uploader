const http = require('./http');

exports.getFileList = function(dirName) {
	return http.get('/getFileList', dirName && {
		dir : dirName,
	});
}
