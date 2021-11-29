import React from 'react';
import { createUseStyles } from 'react-jss';

import * as adminActions from '../services/admin-actions';

import Alert from './alert';
import Button from './button';
import FolderSelector from './folder-selector';
import H1 from './h1';

import TrashIcon from '../svg/trash.svg';

const useStyles = createUseStyles({
	table : {
		width : '100%',
		borderColor : '#444',
		borderWidth : '1px',
		borderStyle : 'solid',
		borderCollapse : 'collapse',
		margin : '16px 0',
		backgroundColor : '#222',
	},
	td : {
		borderColor : '#444',
		borderWidth : '1px 0',
		borderStyle : 'solid',
		padding : '8px 16px',
	},
	icon : {
		fill : 'white',
		width : '24px',
		height : '24px',
	},
});

export default function Admin() {
	const classes = useStyles();

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
		return adminActions.addFolder(folderName)
		.then(adminActions.getFolders)
		.then(function(result) {
			setFolders(result);
		}).then(backToFolders)
		.catch(function(error) {
			setError(error);
		});
	};

	const remove = function(id) {
		adminActions.removeFolder(id)
		.then(adminActions.getFolders)
		.then(function(result) {
			setFolders(result);
		}).then(backToFolders)
		.catch(function(error) {
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
						<table className={classes.table}>
							<tbody>
								{folders.map(elt => (
									<tr key={elt.id}>
										<td className={classes.td}>{elt.name}</td>
										<td className={classes.td}>{elt.path}</td>
										<td className={classes.td}>
											<TrashIcon className={classes.icon} onClick={() => remove(elt.id)}/>
										</td>
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
}
