const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const actions = require('../services/actions');

const Alert = require('./alert');
const FileRow = require('./file-row');
const H1 = require('./h1');
const H2 = require('./h2');
const Loader = require('./loader');
const UploadForm = require('./upload-form');

const ArrowCircleUpIcon = require('../svg/arrow-circle-up.svg').default;
const SearchIcon = require('../svg/search.svg').default;

const styles = StyleSheet.create({
	fileList : {
		borderRadius : '4px',
		width : '100%',
		display : 'flex',
		flexDirection : 'column',
	},
	button : {
		width : '48px',
		height : '48px',
		backgroundColor : '#123',
		fill : '#EEE',
		padding : '4px',
		borderRadius : '4px',
		borderWidth : '0px',
		':hover' : {
			backgroundColor : '#234',
		},
	},
	folderIndicator : {
		display : 'flex',
		flexDirection : 'row',
		alignItems : 'center',
		margin : '2px',
	},
	search : {
		padding  :'6px 8px 6px 36px',
		backgroundColor : '#223',
		margin : '4px 4px',
		borderRadius : '4px',
		color : '#EEE',
		borderStyle : 'solid',
		borderWidth : '1px',
		borderColor : '#EEE',
		fontSize : '16px',
		flexBasis : '100%',
	},
	searchContainer : {
		display : 'flex',
	},
	searchIcon : {
		width : '24px',
		height : '24px',
		margin : '12px',
		position : 'absolute',
		fill : '#EEE',
	},
});

module.exports = function Main() {
	const [error, setError] = React.useState(null);
	const [currentFolderId, setCurrentFolderId] = React.useState(null);
	const [currentDir, setCurrentDir] = React.useState('');
	const [files, setFiles] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [searchText, setSearchText] = React.useState('');

	const updateFileList = function(folderId, dirName) {
		setLoading(true);
		actions.getFileList(folderId, dirName).then(function(result) {
			setFiles(result.files);
			setCurrentDir(result.dir);
			setCurrentFolderId(result.folderId);
			setLoading(false);
			setSearchText('');
		}).catch(function(error) {
			setError(error);
			setLoading(false);
		});
	};

	const getDirFileList = function(folderId, dirName) {
		updateFileList(folderId, dirName && currentDir + '/' +dirName);
	};

	const parentDir = function() {
		if (currentDir) {
			const parts = currentDir.split('/');
			parts.splice(-1);
			updateFileList(currentFolderId, parts.join('/'));
		}
	};

	const search = function(event) {
		setSearchText(event.target.value);
	};

	const showFile = function(fileName) {
		let show = true;
		if (searchText) {
			const parts = searchText.toLowerCase().split(' ');
			for (let i=0; i<parts.length; i++) {
				if (!parts[i]) {
					continue;
				}
				if (fileName.toLowerCase().indexOf(parts[i]) === -1) {
					show = false;
					break;
				}
			}
		}
		return show;
	};

	React.useEffect(function() {
		updateFileList();
	}, []);

	// console.log(files);

	return (
		<React.Fragment>
			<H1>File Share</H1>
			<UploadForm/>
			<div className={css(styles.folderIndicator)}>
				{loading ?
					<Loader/>
				:
					currentDir && (
						<button onClick={parentDir} className={css(styles.button)}>
							<ArrowCircleUpIcon/>
						</button>
					)
				}
				{currentDir &&
					<H2>{currentFolderId} {currentDir}</H2>
				}
			</div>
			{error && <Alert>{error}</Alert>}
			<div className={css(styles.searchContainer)}>
				<SearchIcon className={css(styles.searchIcon)} />
				<input type="text" onChange={search} value={searchText} className={css(styles.search)} />
			</div>
			<div className={css(styles.fileList)}>
				{files.filter(file => showFile(file.name)).map(file => (
					<FileRow
						key={file.name}
						file={file}
						onDirClick={() => getDirFileList(file.isRoot ? file.id : currentFolderId, file.isRoot ? '' : file.name)}
						currentDir={currentDir}
						currentFolderId={currentFolderId}
					/>
				))}
			</div>
		</React.Fragment>
	);
};
