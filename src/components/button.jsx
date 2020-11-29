const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const styles = StyleSheet.create({
	button : {
		padding : '8px 16px',
		fontSize : '18px',
		lineHeight : '1.3333333',
		borderRadius: '6px',
		color: '#ffffff',
		backgroundColor: '#F89406',
		border: 'none',
		':hover' : {
			color : '#FFF',
			backgroundColor : '#FA8900',
		},
		':focus' : {
			color : '#FFF',
			backgroundColor : '#FA8900',
		},
		':active' : {
			color : '#FFF',
			backgroundColor : '#FA8900',
		},
	},
});

module.exports = function({
	children,
	onClick,
}) {
	return (
		<button className={css(styles.button)} type="button" onClick={onClick}>{children}</button>
	);
}
