const React = require('react');

const adminActions = require('../services/admin-actions');

const Button = require('./button');
const FolderSelector = require('./folder-selector');
const H1 = require('./h1');

module.exports = function Admin() {
	const [page, setPage] = React.useState('folders');
	const [folders, setFolders] = React.useState(null);

	React.useEffect(function() {
		adminActions.getFolders().then(function(result) {
			setFolders(result);
		}).catch(function(error) {
			console.error(error);
		});
	}, []);

	console.log(folders);
	const addFolder = function() {
		setPage('addFolder');
	};

	const backToFolders= function() {
		setPage('folders');
	};

	const selectFolder = function(event) {
		console.log(event.target.files)
	};

	return (
		<React.Fragment>
			<H1>File Share Admin</H1>
			{page === 'folders' &&
				<React.Fragment>
					<Button onClick={addFolder}>Add folder</Button>
					<table>
						<thead>
							<tr>
								<th></th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</React.Fragment>
			}
			{page === 'addFolder' &&
				<FolderSelector
					back={backToFolders}
					selectFolder={selectFolder}
				/>
			}
		</React.Fragment>
	);
};
