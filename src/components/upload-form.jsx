import classnames from 'classnames';
import React from 'react';
import { createUseStyles } from 'react-jss';

import * as utils from '../services/utils';

import Button from './button';

const useStyles = createUseStyles({
	uploadInput : {
		display : 'none',
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
	error : {
		backgroundColor : '#800',
	},
	success : {
		backgroundColor : '#080',
	},
});

export default function UploadForm() {
	const classes = useStyles();

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
			className={classnames(classes.panelBody, drag && classes.drag)}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<Button onClick={triggerSelectFile}>Upload File</Button>
			<input className={classes.uploadInput} type="file" name="uploads[]" multiple="multiple " onChange={upload} ref={uploadInputRef} />

			{filesInUpload.map(file => file.complete ?
				<div
					key={file.index}
					className={classnames(classes.fileItem, file.success ? classes.success : classes.error)}
				>
					<span className="file-text">{file.name}</span>
				</div>
			:
				<div key={file.index} className={classnames(classes.fileItem, classes.fileInUpload)}>
					<div className={classes.fileText}>{file.name} : {file.progress} %</div>
					<div className={classes.progressBar} role="progressbar" style={{width : file.progress+'%'}} />
				</div>
			)}
		</div>
	);
}
