const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const adminActions = require('../services/admin-actions');

const Alert = require('./alert');
const Button = require('./button');
const FileItem = require('./file-item');
const H2 = require('./h2');
const Loader = require('./loader');

const styles = StyleSheet.create({
	fileList : {
		borderRadius : '4px',
		width : '100%',
		display : 'flex',
		flexDirection : 'column',
	},
});

module.exports = function FolderSelector({
	back,
	selectFolder,
}) {
	const [error, setError] = React.useState(null);
	const [currentDir, setCurrentDir] = React.useState('');
	const [files, setFiles] = React.useState(null);
	const [loading, setLoading] = React.useState(false);

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

	return (
		<React.Fragment>
			{error && <Alert>{error}</Alert>}
			<Button onClick={() => selectFolder(currentDir)}>Select</Button>
			<Button onClick={back}>Back</Button>
			{!loading && currentDir && (
				<Button onClick={parentDir}>Parent Folder</Button>
			)}
			<div className={css(styles.folderIndicator)}>
				{loading && <Loader/>}
				{currentDir && <H2>{currentDir}</H2>}
			</div>
			{loading && <div>Loading</div>}
			<div className={css(styles.fileList)}>
				{files && files.map((elt, idx) => (
					<FileItem
						key={idx}
						file={elt}
						onDirClick={() => getDirFileList(elt.name)}
					/>
				))}
			</div>
		</React.Fragment>
	);
};
