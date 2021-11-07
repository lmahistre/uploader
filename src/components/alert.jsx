import { StyleSheet, css } from 'aphrodite/no-important';
import React from 'react';

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

export default function Alert(props) {
	return (
		<div className={css(styles.alert)}>{props.children}</div>
	);
}
