const React = require('react');

class Form extends React.Component {

	constructor() {
		super();
		this.state = {
			uploading : false,
			progress : 0,
		}
	}

	upload(event) {
		const self = this;
		const files = event.target.files;
		this.setState({
			uploading : true,
		});

		if (files.length > 0){
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
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
				});
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
			<div className="panel-body">
				<h1>{"File Uploader"}</h1>
				{this.state.uploading ?
					<div className="progress">
						<div className="progress-bar" role="progressbar" style={{width : this.state.progress+'%'}}>{progressLabel}</div>
					</div>
				:
					<button className="upload-btn" type="button" onClick={this.triggerSelectFile.bind(this)}>{"Upload File"}</button>
				}
				<input id="upload-input" type="file" name="uploads[]" multiple="multiple " onChange={this.upload.bind(this)} />
			</div>
		);
	}
}

module.exports = Form;
