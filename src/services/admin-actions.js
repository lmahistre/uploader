const http = require('./http');

exports.getFolders = function() {
	return http.get('/admin/getFolders');
};

exports.getFolderContent = function(path) {
	return http.get('/admin/getFolderContent', {path});
};
