import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { readableSize } from '../services/utils';

import BanIcon from '../svg/ban.svg';
import FileIcon from '../svg/file.svg';
import FolderIcon from '../svg/folder.svg';

const useStyles = createUseStyles({
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

export default function FileRow ({
	currentDir,
	currentFolderId,
	file,
	onDirClick,
}) {
	const classes = useStyles();

	if (file.error) {
		return (
			<div className={classes.elt}>
				<BanIcon className={classes.icon} />
				<span className={classes.fileName}>{file.name}</span>
			</div>
		);
	}
	else {
		return file.isDir ? (
			<div className={classes.elt} onClick={onDirClick}>
				<FolderIcon className={classes.icon} />
				<span className={classes.fileName}>{file.name}</span>
			</div>
		) : (
			<a href={'/file/'+currentFolderId+encodeURI(currentDir+'/'+file.name)} className={classnames(classes.elt, classes.file)}>
				<FileIcon className={classes.icon} />
				<span className={classes.fileName}>{file.name}</span>
				<span>{readableSize(file.size)}</span>
			</a>
		);
	}
}
