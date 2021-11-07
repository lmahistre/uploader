import * as http from './http';

export function getFileList(folderId, dirName) {
	return http.get('/getFileList', {
		folderId,
		dir : dirName,
	});
}
