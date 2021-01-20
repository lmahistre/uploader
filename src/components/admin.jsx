const React = require('react');

const adminActions = require('../services/admin-actions');

const Alert = require('./alert');
const Button = require('./button');
const FolderSelector = require('./folder-selector');
const H1 = require('./h1');

module.exports = function Admin() {
	const [error, setError] = React.useState(null);
	const [page, setPage] = React.useState('folders');
	const [folders, setFolders] = React.useState(null);

	React.useEffect(function() {
		adminActions.getFolders().then(function(result) {
			setFolders(result);
		}).catch(function(error) {
			setError(error);
		});
	}, []);

	const openFolderSelector = function() {
		setPage('folderSelector');
	};

	const backToFolders= function() {
		setPage('folders');
	};

	const selectFolder = function(folderName) {
		return adminActions.addFolder(folderName).then(adminActions.getFolders).then(function(result) {
			setFolders(result);
		}).then(backToFolders).catch(function(error) {
			setError(error);
		});
	};

	return (
		<React.Fragment>
			<H1>File Share Admin</H1>
			{page === 'folders' &&
				<React.Fragment>
					{error && <Alert>{error}</Alert>}
					<Button onClick={openFolderSelector}>Add folder</Button>
					{folders &&
						<table>
							<tbody>
								{folders.map(elt => (
									<tr key={elt.id}>
										<td>{elt.name}</td>
										<td>{elt.path}</td>
										<td></td>
									</tr>
								))}
							</tbody>
						</table>
					}
				</React.Fragment>
			}
			{page === 'folderSelector' &&
				<FolderSelector
					back={backToFolders}
					selectFolder={selectFolder}
				/>
			}
		</React.Fragment>
	);
};
