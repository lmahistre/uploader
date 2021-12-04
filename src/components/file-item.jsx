import React from 'react';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';

import * as utils from '../services/utils';

import BanIcon from '../svg/ban.svg';
import FileIcon from '../svg/file.svg';
import FolderIcon from '../svg/folder.svg';

const useStyles = createUseStyles({
	elt : {
		margin : '2px',
		backgroundColor : '#123',
		padding : '4px 8px',
		borderRadius : '4px',
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		':hover' : {
			backgroundColor : '#234',
		},
	},
	file : {
		color : '#CCC',
		textDecoration : 'none',
		cursor : 'not-allowed',
	},
	folder : {
		cursor : 'pointer',
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

export default function FileItem({
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
			<div className={classnames(classes.elt, classes.folder)} onClick={onDirClick}>
				<FolderIcon className={classes.icon} />
				<span className={classes.fileName}>{file.name}</span>
			</div>
		) : (
			<span className={classnames(classes.elt, classes.file)}>
				<FileIcon className={classes.icon} />
				<span className={classes.fileName}>{file.name}</span>
				<span>{utils.readableSize(file.size)}</span>
			</span>
		);
	}
}
