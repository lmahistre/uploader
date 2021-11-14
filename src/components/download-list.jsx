import { StyleSheet, css } from 'aphrodite/no-important';
import React from 'react';

import * as actions from '../services/actions';

import Alert from './alert';
import FileRow from './file-row';
import H2 from './h2';
import Loader from './loader';

import ArrowCircleUpIcon from '../svg/arrow-circle-up.svg';
import SearchIcon from '../svg/search.svg';

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

export default function Main() {
	const [error, setError] = React.useState(null);
	const [currentFolderId, setCurrentFolderId] = React.useState(null);
	const [currentDir, setCurrentDir] = React.useState(null);
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
			<div className={css(styles.folderIndicator)}>
				{loading ?
					<Loader/>
				:
					currentFolderId && (
						<React.Fragment>
							<button onClick={parentDir} className={css(styles.button)}>
								<ArrowCircleUpIcon/>
							</button>
							<H2>{currentFolderId} {currentDir}</H2>
						</React.Fragment>
					)
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
}
