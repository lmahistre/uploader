const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const adminActions = require('../services/admin-actions');

const Alert = require('./alert');
const Button = require('./button');
const FileItem = require('./file-item');

const styles = StyleSheet.create({
	fileList : {
		borderRadius : '4px',
		width : '100%',
		display : 'flex',
		flexDirection : 'column',
	},
});

module.exports = function FolderSelector({
	back,
}) {
	const [folder, setFolder] = React.useState('~');
	const [content, setContent] = React.useState(null);
	const [error, setError] = React.useState(null);

	const getFolderContent = function() {
		adminActions.getFolderContent(folder).then(function({ dir, files }) {
			setFolder(dir);
			setContent(files);
		}).catch(setError);
	};

	React.useEffect(getFolderContent, []);

	return (
		<React.Fragment>
			<Button>Select</Button>
			<Button onClick={back}>Back</Button>
			{error && <Alert>{error}</Alert>}
			<h3>{folder}</h3>
			<div className={css(styles.fileList)}>
				{content && content.map((elt, idx) => (
					<div key={idx}>{elt.name}</div>
				))}
			</div>
		</React.Fragment>
	);
};
