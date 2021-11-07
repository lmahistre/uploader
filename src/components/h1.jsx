import { StyleSheet, css } from 'aphrodite/no-important';
import React from 'react';

const styles = StyleSheet.create({
	h1 : {
		color: '#FFF',
		margin: '0 0 16px 0',
		fontSize: '24px',
	},
});

export default function H1(props) {
	return (
		<React.Fragment>
			<h1 className={css(styles.h1)}>{props.children}</h1>
		</React.Fragment>
	);
}
