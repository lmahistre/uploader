const http = require('./http');

exports.getFileList = function(folderId, dirName) {
	return http.get('/getFileList', dirName && {
		folderId,
		dir : dirName,
	});
};
