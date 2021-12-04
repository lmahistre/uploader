import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	button : {
		padding : '8px 16px',
		fontSize : '18px',
		lineHeight : '18px',
		borderRadius: '6px',
		color: '#FFF',
		backgroundColor: '#E50',
		border: 'none',
		cursor : 'pointer',
		margin : '0 4px',
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

export default function Button({
	children,
	onClick,
}) {
	const classes = useStyles();

	return (
		<button className={classes.button} type="button" onClick={onClick}>{children}</button>
	);
}
