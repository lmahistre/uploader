const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const ClockIcon = require('../svg/clock.svg').default;

const styles = StyleSheet.create({
	container : {
		width : '48px',
		height : '48px',
		backgroundColor : '#123',
		padding : '4px',
		borderRadius : '4px',
		borderWidth : '0px',
		boxSizing: 'border-box',
	},
	icon : {
		fill : '#EEE',
		animation: 'fa-spin 2s infinite linear',
		width : '40px',
		height : '40px',
	},
});

module.exports = function Loader() {
	return (
		<div className={css(styles.container)}>
			<ClockIcon className={css(styles.icon)} />
		</div>
	);
};
