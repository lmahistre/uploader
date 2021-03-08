const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const utils = require('../services/utils');

const BanIcon = require('../svg/ban.svg').default;
const FileIcon = require('../svg/file.svg').default;
const FolderIcon = require('../svg/folder.svg').default;

const styles = StyleSheet.create({
	elt : {
		margin : '2px',
		backgroundColor : '#123',
		padding : '4px 8px',
		borderRadius : '4px',
		cursor : 'pointer',
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		':hover' : {
			backgroundColor : '#234',
		},
	},
	file : {
		color : '#EEE',
		textDecoration : 'none',
	},
	icon : {
		fill : '#EEE',
		width : '24px',
		height : '24px',
	},
	fileName : {
		flexBasis : '100%',
		marginLeft : '4px',
		marginRight : '4px',
	},
});

module.exports = function FileRow ({
	currentDir,
	currentFolderId,
	file,
	onDirClick,
}) {
	if (file.error) {
		return (
			<div className={css(styles.elt)}>
				<BanIcon className={css(styles.icon)} />
				<span className={css(styles.fileName)}>{file.name}</span>
			</div>
		);
	}
	else {
		return file.isDir ? (
			<div className={css(styles.elt)} onClick={onDirClick}>
				<FolderIcon className={css(styles.icon)} />
				<span className={css(styles.fileName)}>{file.name}</span>
			</div>
		) : (
			<a href={'/file/'+currentFolderId+encodeURI(currentDir+'/'+file.name)} className={css(styles.elt, styles.file)}>
				<FileIcon className={css(styles.icon)} />
				<span className={css(styles.fileName)}>{file.name}</span>
				<span>{utils.readableSize(file.size)}</span>
			</a>
		);
	}
};
