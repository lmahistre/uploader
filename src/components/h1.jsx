import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	h1 : {
		color: '#FFF',
		margin: '0 0 16px 0',
		fontSize: '24px',
	},
});

export default function H1(props) {
	const classes = useStyles();
	return (
		<React.Fragment>
			<h1 className={classes.h1}>{props.children}</h1>
		</React.Fragment>
	);
}
