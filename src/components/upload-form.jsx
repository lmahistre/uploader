import { StyleSheet, css } from 'aphrodite/no-important';
import React from 'react';

import * as utils from '../services/utils';

import Button from './button';

const styles = StyleSheet.create({
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
	fileItem : {
		margin: '4px 0',
		padding: '4px 8px',
		borderRadius: '4px',
		height: '20px',
		lineHeight: '20px',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		clear: 'both',
		overflowX : 'hidden',
	},
	fileInUpload : {
		backgroundColor : '#159',
		padding: '0',
		height: '28px',
	},
	fileText : {
		width : '100%',
		display : 'block',
		padding: '4px 8px',
		boxSizing : 'border-box',
	},
	progressBar : {
		float : 'left',
		width : '0',
		height: '28px',
		lineHeight: '20px',
		textAlign: 'center',
		backgroundColor: '#E80',
		transition: 'width .6s linear',
		marginTop : '-28px',
		borderRadius : '2px',
		padding: '4px 8px',
		boxSizing : 'border-box',
	},
	error : {
		backgroundColor : '#800',
	},
	success : {
		backgroundColor : '#080',
	},
});

export default function UploadForm() {
	const [drag, setDrag] = React.useState(false);
	const [filesInUpload, setFilesInUpload] = React.useState([]);

	const uploadInputRef = React.createRef();

	const uploadFiles = function(files) {
		if (files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const formData = new FormData();
				const file = files[i];

				const fileInUpload = {
					name : file.name,
					index : filesInUpload.length,
					progress : 0,
					complete : false,
				};
				formData.append('uploads[]', file, file.name);

				filesInUpload.push(fileInUpload);
				setFilesInUpload([...filesInUpload]);

				const xhr = new XMLHttpRequest();
				xhr.open('POST', '/upload', true);

				xhr.upload.addEventListener('progress', function(evt) {
					if (evt.lengthComputable) {
						let percentComplete = parseInt(100 * evt.loaded / evt.total);

						filesInUpload[fileInUpload.index].progress = percentComplete;
						setFilesInUpload([...filesInUpload]);
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

						setFilesInUpload([...filesInUpload]);
					}, 100);
				});
				xhr.send(formData);
			}
		}
	};

	const upload = function(event) {
		const files = event.target.files;
		uploadFiles(files);
	};

	const triggerSelectFile = function() {
		uploadInputRef.current.click();
	};

	const handleDragOver = function(event) {
		event.stopPropagation();
		event.preventDefault();
		setDrag(true);
	};

	const handleDrop = function(event) {
		event.stopPropagation();
		event.preventDefault();
		setDrag(false);
		uploadFiles(event.dataTransfer.files);
	};

	return (
		<div
			className={css(styles.panelBody, drag && styles.drag)}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<Button onClick={triggerSelectFile}>Upload File</Button>
			<input className={css(styles.uploadInput)} type="file" name="uploads[]" multiple="multiple " onChange={upload} ref={uploadInputRef} />

			{filesInUpload.map(file => file.complete ?
				<div
					key={file.index}
					className={css(styles.fileItem, file.success ? styles.success : styles.error)}
				>
					<span className="file-text">{file.name}</span>
				</div>
			:
				<div key={file.index} className={css(styles.fileItem, styles.fileInUpload)}>
					<div className={css(styles.fileText)}>{file.name} : {file.progress} %</div>
					<div className={css(styles.progressBar)} role="progressbar" style={{width : file.progress+'%'}} />
				</div>
			)}
		</div>
	);
}
