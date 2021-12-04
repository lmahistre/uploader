import React from 'react';
import { createUseStyles } from 'react-jss';

import * as adminActions from '../services/admin-actions';

import Alert from './alert';
import Button from './button';
import FileItem from './file-item';
import H2 from './h2';
import Loader from './loader';

const useStyles = createUseStyles({
	fileList : {
		borderRadius : '4px',
		width : '100%',
		display : 'flex',
		flexDirection : 'column',
	},
	folderIndicator : {
		margin : '4px 0',
	},
});

export default function FolderSelector({
	back,
	selectFolder,
}) {
	const classes = useStyles();

	const [error, setError] = React.useState(null);
	const [currentDir, setCurrentDir] = React.useState('');
	const [files, setFiles] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const [showHiddenFiles, setShowHiddenFiles] = React.useState(false);

	const updateFileList = function(dirName) {
		setLoading(true);
		adminActions.getFolderContent(dirName).then(function(result) {
			setCurrentDir(result.dir);
			setFiles(result.files);
			setLoading(false);
		}).catch(function(error) {
			setError(error);
			setLoading(false);
		});
	};

	const getDirFileList = function(dirName) {
		updateFileList(currentDir + '/' +dirName);
	};

	const parentDir = function() {
		if (currentDir) {
			const parts = currentDir.split('/');
			parts.splice(-1);
			updateFileList(parts.join('/'));
		}
	};

	React.useEffect(function() {
		updateFileList(currentDir);
	}, []);

	const toggleShowHiddenFiles = function() {
		setShowHiddenFiles(!showHiddenFiles);
	};

	const filterFiles = function(elt) {
		// console.log(elt);
		return showHiddenFiles || !elt.name.startsWith('.');
	};

	return (
		<React.Fragment>
			{error && <Alert>{error}</Alert>}
			<Button onClick={() => selectFolder(currentDir)}>Select</Button>
			<Button onClick={back}>Back</Button>
			{!loading && currentDir && (
				<Button onClick={parentDir}>Parent Folder</Button>
			)}
			<div className={classes.folderIndicator}>
				{loading && <Loader/>}
				{currentDir && <H2>{currentDir}</H2>}
			</div>
			<div onClick={toggleShowHiddenFiles} className={classes.folderIndicator}>
				<input type="checkbox" checked={showHiddenFiles} />
				<label>Show hidden files</label>
			</div>
			{loading && <div>Loading</div>}
			<div className={classes.fileList}>
				{files && files.filter(filterFiles).map((elt, idx) => (
					<FileItem
						key={idx}
						file={elt}
						onDirClick={() => getDirFileList(elt.name)}
					/>
				))}
			</div>
		</React.Fragment>
	);
}
