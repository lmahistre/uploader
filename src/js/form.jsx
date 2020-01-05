const React = require('react');

const utils = require('./utils');

class Form extends React.Component {
	constructor() {
		super();
		this.state = {
			uploading : false,
			progress : 0,
			uploaded : [],
		}
	}

	upload(event) {
		this.setState({
			uploading : true,
		});
		const self = this;
		const files = event.target.files;

		if (files.length > 0) {
			const formData = new FormData();
			const fileNames = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				fileNames.push(file.name);
				formData.append('uploads[]', file, file.name);
			}

			const xhr = new XMLHttpRequest();
			xhr.open('POST', '/upload', true);
			xhr.upload.addEventListener('progress', function(evt) {
				if (evt.lengthComputable) {
					let percentComplete = evt.loaded / evt.total;
					percentComplete = parseInt(percentComplete * 100);
					self.setState({
						progress : percentComplete,
					});
				}
			}, false);
			xhr.upload.addEventListener('loadend', function(event) {
				self.setState({
					uploading : false,
					uploaded : self.state.uploaded.concat(fileNames),
				});
				if (!document.hasFocus()) {
					utils.notify('File'+(fileNames.length > 1 ? 's' : '')+' "' + fileNames.join('", "') + '" uploaded');
				}
			});
			xhr.send(formData);
		}
	}

	triggerSelectFile() {
		document.getElementById('upload-input').click();
		this.setState({
			progress : 0,
		});
	}

	render() {
		const progressLabel = this.state.progress < 100 ? this.state.progress+'%' : 'Done';
		return (
			<React.Fragment>
				<h1>{"File Uploader"}</h1>
				<div className="panel-body">
					{this.state.uploading ?
						<div className="progress">
							<div className="progress-bar" role="progressbar" style={{width : this.state.progress+'%'}}>{progressLabel}</div>
						</div>
					:
						<button className="upload-btn" type="button" onClick={this.triggerSelectFile.bind(this)}>{"Upload File"}</button>
					}
					<input id="upload-input" type="file" name="uploads[]" multiple="multiple " onChange={this.upload.bind(this)} />
				</div>
				{this.state.uploaded.length ?
					<div className="panel-body">
						<h2>Uploaded files</h2>
						{this.state.uploaded.map((fileName, idx) => (
							<div key={idx} className="file-item">{fileName}</div>
						))}
					</div>
				: null}
			</React.Fragment>
		);
	}
}

module.exports = Form;
