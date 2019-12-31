const React = require('react');

module.exports = class List extends React.Component {
	render() {
		return (
			<div>
				<h3>Uploaded files</h3>
				{this.props.files.map(file => (
					<div>{file.name}</div>
				))}
			</div>
		);
	}
}
