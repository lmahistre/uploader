const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const styles = StyleSheet.create({
	alert : {
		backgroundColor : '#200',
		borderRadius : '4px',
		borderWidth : '1px',
		borderStyle : 'solid',
		borderColor : '#F88',
		padding : '4px 8px',
		margin : '4px',
	},
});

module.exports = class Alert extends React.Component {
	render() {
		return (
			<div className={css(styles.alert)}>{this.props.children}</div>
		);
	}
}
