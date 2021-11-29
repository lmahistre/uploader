import * as http from './http';

export function getFolders() {
	return http.get('/admin/getFolders');
}

export function getFolderContent(dir) {
	return http.get('/admin/getFolderContent', {dir});
}

export function addFolder(dir) {
	return http.post('/admin/addFolder', {dir});
}

export function removeFolder(id) {
	return http.post('/admin/removeFolder', {id});
}
