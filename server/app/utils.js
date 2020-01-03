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
		const num = parseInt(lastNamePart.replace(')', ''));

		if (lastNamePart === parseInt(lastNamePart) + ')') {
			lastNum = parseInt(lastNamePart) + 1;
			name = nameParts.join(' (');
		}
	}

	let newName = name + ' (' + lastNum + ')';

	return newName + (extension ? '.' + extension : '');
}
