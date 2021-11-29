import { createUseStyles } from 'react-jss';
import React from 'react';

const useStyles = createUseStyles({
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
	const classes = useStyles();
	return (
		<div className={classes.alert}>{props.children}</div>
	);
}
