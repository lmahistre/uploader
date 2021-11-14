import React from 'react';

import DownloadList from './download-list';
import H1 from './h1';
import UploadForm from './upload-form';

export default function Main() {
	return (
		<React.Fragment>
			<H1>File Share</H1>
			<UploadForm/>
			<DownloadList/>
		</React.Fragment>
	);
}
