
const React = require('react');
const jQuery = require('jquery');

class Form extends React.Component {

	constructor() {
		super();
		this.state = {
			progress : 0,
		}
	}

	upload(event) {
		const self = this;
		const files = event.target.files;

		if (files.length > 0){
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				formData.append('uploads[]', file, file.name);
			}

			jQuery.ajax({
				url: '/upload',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
					console.log('upload successful!\n' + data);
				},
				xhr: function() {
					const xhr = new XMLHttpRequest();
					xhr.upload.addEventListener('progress', function(evt) {
						if (evt.lengthComputable) {
							let percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);
							self.setState({
								progress : percentComplete,
							});
						}
					}, false);
					return xhr;
				}
			});
		}
	}


	triggerUpload() {
		document.getElementById('upload-input').click();
		this.setState({
			progress : 0,
		});
	}


	render() {
		const progressLabel = this.state.progress < 100 ? this.state.progress+'%' : 'Done';
		return (
			<div class="row">
				<div class="col-xs-12">
					<div class="panel panel-default">
						<div className="panel-body">
							<h2>{"File Uploader"}</h2>
							<div className="progress">
								<div className="progress-bar" role="progressbar" style={{width : this.state.progress+'%'}}>{progressLabel}</div>
							</div>
							<button className="btn btn-lg upload-btn" type="button" onClick={this.triggerUpload.bind(this)}>{"Upload File"}</button>
							<input id="upload-input" type="file" name="uploads[]" multiple="multiple " onChange={this.upload.bind(this)} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = Form;