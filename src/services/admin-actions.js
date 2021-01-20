const http = require('./http');

exports.getFolders = function() {
	return http.get('/admin/getFolders');
};

exports.getFolderContent = function(dir) {
	return http.get('/admin/getFolderContent', {dir});
};

exports.addFolder = function(dir) {
	return http.post('/admin/addFolder', {dir});
};
