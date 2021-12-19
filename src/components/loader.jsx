import React from 'react';
import { createUseStyles } from 'react-jss';

import ClockIcon from '../svg/clock.svg';

const useStyles = createUseStyles({
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

export default function Loader() {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<ClockIcon className={classes.icon} />
		</div>
	);
}
