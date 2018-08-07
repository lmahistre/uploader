
const React = require('react');
const $ = require('jquery');

class Form extends React.Component {

	upload(event) {
		var files = $(event.target).get(0).files;

		if (files.length > 0){
			var formData = new FormData();

			// loop through all the selected files and add them to the formData object
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				formData.append('uploads[]', file, file.name);
			}

			$.ajax({
				url: '/upload',
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
						console.log('upload successful!\n' + data);
				},
				xhr: function() {
					var xhr = new XMLHttpRequest();

					// listen to the 'progress' event
					xhr.upload.addEventListener('progress', function(evt) {

						if (evt.lengthComputable) {
							// calculate the percentage of upload completed
							var percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);

							// update the Bootstrap progress bar with the new percentage
							$('.progress-bar').text(percentComplete + '%');
							$('.progress-bar').width(percentComplete + '%');

							if (percentComplete === 100) {
								$('.progress-bar').html('Done');
							}

						}

					}, false);
					return xhr;
				}
			});
		}
	}


	triggerUpload() {
		document.getElementById('upload-input').click();
		$('.progress-bar').text('0%');
		$('.progress-bar').width('0%');
	}


	render() {
		return (
			<div className="panel-body">
				<h2>File Uploader</h2>
				<div className="progress">
					<div className="progress-bar" role="progressbar"></div>
				</div>
				<button className="btn btn-lg upload-btn" type="button" onClick={this.triggerUpload}>Upload File</button>
				<input id="upload-input" type="file" name="uploads[]" multiple="multiple " onChange={this.upload.bind(this)} />
			</div>
		);
	}
}

module.exports = Form;