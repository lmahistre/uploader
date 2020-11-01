const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const actions = require('../services/actions');

const Alert = require('./alert');
const Form = require('./form');
const H1 = require('./h1');
const Loader = require('./loader');
const FileRow = require('./file-row');

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

module.exports = class Main extends React.Component {
	constructor() {
		super();
		this.state = {
			error : null,
			currentDir : '',
			files : [],
			search : '',
			loading : false,
		}
	}

	updateFileList(dirName) {
		const self = this;
		self.setState({
			loading : true,
		});
		actions.getFileList(dirName).then(function(result) {
			if (result.error) {
				self.setState({
					error : result.error,
					loading : false,
					search : '',
				});
			}
			else {
				self.setState({
					files : result.files,
					currentDir : result.dir,
					error : null,
					loading : false,
					search : '',
				});
			}
		});
	}

	componentDidMount() {
		this.updateFileList();
	}

	getDirFileList(dirName) {
		this.updateFileList(this.state.currentDir + '/' +dirName);
	}

	parentDir() {
		if (this.state.currentDir) {
			const parts = this.state.currentDir.split('/');
			parts.splice(-1);
			this.updateFileList(parts.join('/'));
		}
	}

	search(event) {
		this.setState({
			search : event.target.value,
		});
	}

	showFile(fileName) {
		let show = true;
		if (this.state.search) {
			const parts = this.state.search.toLowerCase().split(' ');
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
	}

	render() {
		return (
			<React.Fragment>
				<H1>File Share</H1>
					<Form/>
					<div className={css(styles.folderIndicator)}>
						{this.state.loading ?
							<Loader/>
						:
							this.state.currentDir && (
								<button onClick={this.parentDir.bind(this)} className={css(styles.button)}>
									<ArrowCircleUpIcon/>
								</button>
							)
						}
						{this.state.currentDir &&
							<H2>{this.state.currentDir}</H2>
						}
					</div>
				{this.state.error && <Alert>{this.state.error}</Alert>}
				<div className={css(styles.searchContainer)}>
					<SearchIcon className={css(styles.searchIcon)} />
					<input type="text" onChange={this.search.bind(this)} value={this.state.search} className={css(styles.search)} />
				</div>
				<div className={css(styles.fileList)}>
					{this.state.files.map(file => this.showFile(file.name) && (
						<FileRow
							file={file}
							onDirClick={this.getDirFileList.bind(this, file.name)}
							currentDir={this.state.currentDir}
						/>
					))}
				</div>
			</React.Fragment>
		);
	}
}
