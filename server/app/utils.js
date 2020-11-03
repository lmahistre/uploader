exports.findNewName = function(oldName) {
	const parts = oldName.split('.');
	let name;
	let extension;
	if (parts.length > 1) {
		extension = parts.pop();
		name = parts.join('.');
	}
	else {
		name = oldName;
	}

	let lastNum = 0;
	if (name[(name.length - 1)] === ')') {
		const nameParts = name.split(' (');
		const lastNamePart = nameParts.pop();

		if (lastNamePart === parseInt(lastNamePart) + ')') {
			lastNum = parseInt(lastNamePart) + 1;
			name = nameParts.join(' (');
		}
	}

	let newName = name + ' (' + lastNum + ')';

	return newName + (extension ? '.' + extension : '');
};

exports.readFileSize = function(str) {
	let fileSize;
	if (str) {
		const prefixes = ['K', 'M', 'G', 'T'];
		const matches = (str+'').toUpperCase().match(new RegExp('[0-9]+[' + prefixes.join('') + ']?'));
		if (matches) {
			fileSize = parseInt(matches[0]);
			const m = matches[0].match(new RegExp('[' + prefixes.join('') + ']'));
			if (m && m[0]) {
				fileSize *= Math.pow(1024, prefixes.indexOf(m[0]) + 1);
			}
		}
	}
	return fileSize;
};
