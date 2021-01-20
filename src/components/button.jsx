const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const styles = StyleSheet.create({
	button : {
		padding : '8px 16px',
		fontSize : '18px',
		lineHeight : '18px',
		borderRadius: '6px',
		color: '#FFF',
		backgroundColor: '#E50',
		border: 'none',
		cursor : 'pointer',
		':hover' : {
			color : '#FFF',
			backgroundColor : '#E80',
		},
		':focus' : {
			color : '#FFF',
			backgroundColor : '#E80',
		},
		':active' : {
			color : '#FFF',
			backgroundColor : '#E80',
		},
	},
});

module.exports = function Button({
	children,
	onClick,
}) {
	return (
		<button className={css(styles.button)} type="button" onClick={onClick}>{children}</button>
	);
};
