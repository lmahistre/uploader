const SEPARATOR = ' ';

module.exports = function(...args) {
	const classes = [];
	for (let i=0; i<args.length; i++) {
		if (typeof args[i] === 'string') {
			const argClasses = args[i].split(SEPARATOR);
			for (let j=0; j<argClasses.length; j++) {
				if (classes.indexOf(argClasses[j]) === -1) {
					classes.push(argClasses[j]);
				}
			}
		}
	}
	return classes.join(SEPARATOR);
}
