const { StyleSheet, css } = require('aphrodite/no-important');
const React = require('react');

const styles = StyleSheet.create({
	h2 : {
		margin : '0 4px',
	},
});

module.exports = function H2(props) {
	return (
		<h2 className={css(styles.h2)}>{props.children}</h2>
	);
};
