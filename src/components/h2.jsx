import { StyleSheet, css } from 'aphrodite/no-important';
import React from 'react';

const styles = StyleSheet.create({
	h2 : {
		margin : '0 4px',
	},
});

export default function H2(props) {
	return (
		<h2 className={css(styles.h2)}>{props.children}</h2>
	);
}
