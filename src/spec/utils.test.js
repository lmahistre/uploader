describe('utils', function() {
	const utils = require('../../server/app/utils');

	it('findNewName', function() {
		expect(utils.findNewName('a.txt')).toBe('a (0).txt');
		expect(utils.findNewName('a(0).txt')).toBe('a(0) (0).txt');
		expect(utils.findNewName('a (0).txt')).toBe('a (1).txt');
		expect(utils.findNewName('a (52).txt')).toBe('a (53).txt');
		expect(utils.findNewName('a')).toBe('a (0)');
		expect(utils.findNewName('a(0)')).toBe('a(0) (0)');
		expect(utils.findNewName('a (0)')).toBe('a (1)');
		expect(utils.findNewName('a (52)')).toBe('a (53)');
		expect(utils.findNewName('a.b.txt')).toBe('a.b (0).txt');
		expect(utils.findNewName('a.b(0).txt')).toBe('a.b(0) (0).txt');
		expect(utils.findNewName('a.b (0).txt')).toBe('a.b (1).txt');
		expect(utils.findNewName('a.b (52).txt')).toBe('a.b (53).txt');
	});

	it('readFileSize', function() {
		expect(utils.readFileSize('150')).toBe(150);
		expect(utils.readFileSize('2k')).toBe(2048);
		expect(utils.readFileSize('10M')).toBe(10485760);
		expect(utils.readFileSize('1G')).toBe(1073741824);
		expect(utils.readFileSize('1T')).toBe(1099511627776);
		expect(utils.readFileSize('az')).toBeUndefined();
		expect(utils.readFileSize()).toBeUndefined();
	});
});
