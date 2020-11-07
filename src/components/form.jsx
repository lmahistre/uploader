const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const utils = require('../services/utils');

const styles = StyleSheet.create({
	fileText : {
		width : '100%',
		display : 'block',
	},
	progressBar : {
		float : 'left',
		width : '0',
		height: '20px',
		lineHeight: '20px',
		textAlign: 'center',
		backgroundColor: '#F89406',
		transition: 'width .6s linear',
		marginTop : '-20px',
	},
	uploadInput : {
		display : 'none',
	},
	panelBody : {
		backgroundColor : '#234',
		borderRadius : '4px',
		padding : '8px',
		marginb : '16px 0',
	},
	drag : {
		backgroundColor : '#468',
	},
	button : {
		padding : '8px 16px',
		fontSize : '18px',
		lineHeight : '1.3333333',
		borderRadius: '6px',
		color: '#ffffff',
		backgroundColor: '#F89406',
		border: 'none',
		':hover' : {
			color : '#FFF',
			backgroundColor : '#FA8900',
		},
		':focus' : {
			color : '#FFF',
			backgroundColor : '#FA8900',
		},
		':active' : {
			color : '#FFF',
			backgroundColor : '#FA8900',
		},
	},
	fileItem : {
		margin: '4px 0',
		padding: '4px 8px',
		borderRadius: '4px',
		height: '20px',
		lineHeight: '20px',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		clear: 'both',
		backgroundColor : '#37b',
		overflowX : 'hidden',
	},
	error : {
		backgroundColor : '#800',
	},
	success : {
		backgroundColor : '#080',
	},
});

class Form extends React.Component {
	constructor() {
		super();
		this.state = {
			index : 0,
			drag : false,
			filesInUpload : [],
		};
		this.uploadInputRef = React.createRef();
	}

	uploadFiles(files) {
		const self = this;
		if (files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const formData = new FormData();
				const file = files[i];

				const {filesInUpload} = self.state;
				const fileInUpload = {
					name : file.name,
					index : filesInUpload.length,
					progress : 0,
					complete : false,
				};
				formData.append('uploads[]', file, file.name);

				filesInUpload.push(fileInUpload);
				self.setState({filesInUpload});

				const xhr = new XMLHttpRequest();
				xhr.open('POST', '/upload', true);

				xhr.upload.addEventListener('progress', function(evt) {
					if (evt.lengthComputable) {
						let percentComplete = parseInt(100 * evt.loaded / evt.total);

						const {filesInUpload} = self.state;
						filesInUpload[fileInUpload.index].progress = percentComplete;
						self.setState({filesInUpload});
					}
				}, false);

				xhr.upload.addEventListener('load', function() {
					setTimeout(function() {
						let success;
						let error;
						try {
							const response = JSON.parse(xhr.response);
							if (response.success) {
								success = response.success;
							}
							else if (response.error) {
								error = response.error;
							}
						}
						catch (err) {
							error = 'Cannot parse response';
						}

						const { filesInUpload } = self.state;

						if (success) {
							if (!document.hasFocus()) {
								utils.notify('File "' + file.name + '" uploaded');
							}
						}
						else {
							console.error(error);
							if (!document.hasFocus()) {
								utils.notify('Upload of file "' + file.name + '" failed');
							}
						}

						for (let j=0; j<filesInUpload.length; j++) {
							if (fileInUpload.index === filesInUpload[j].index) {
								filesInUpload[j].complete = true;
								if (success) {
									filesInUpload[j].success = success;
								}
								if (error) {
									filesInUpload[j].error = error;
								}
							}
						}

						self.setState({
							filesInUpload,
						});
					}, 100);
				});
				xhr.send(formData);
			}
		}
	}

	upload(event) {
		const files = event.target.files;
		this.uploadFiles(files);
	}

	triggerSelectFile() {
		this.uploadInputRef.current.click();
		this.setState({
			progress : 0,
		});
	}

	handleDragOver(event) {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			drag : true,
		});
	}

	handleDrop(event) {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			drag : false,
		});
		this.uploadFiles(event.dataTransfer.files);
	}

	render() {
		return (
			<div
				className={css(styles.panelBody, this.state.drag && styles.drag)}
				onDragOver={this.handleDragOver.bind(this)}
				onDrop={this.handleDrop.bind(this)}
			>
				<button className={css(styles.button)} type="button" onClick={this.triggerSelectFile.bind(this)}>Upload File</button>
				<input className={css(styles.uploadInput)} type="file" name="uploads[]" multiple="multiple " onChange={this.upload.bind(this)} ref={this.uploadInputRef} />

				{this.state.filesInUpload.map(file => file.complete ?
					<div
						key={file.index}
						className={css(styles.fileItem, file.success ? styles.success : styles.error)}
					>
						<span className="file-text">{file.name}</span>
					</div>
				:
					<div key={file.index} className={css(styles.fileItem)}>
						<span className={css(styles.fileText)}>{file.name} : {file.progress} %</span>
						<div className={css(styles.progressBar)} role="progressbar" style={{width : file.progress+'%'}} />
					</div>
				)}
			</div>
		);
	}
}

module.exports = Form;
