import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
	h2 : {
		margin : '0 4px',
		fontWeight : 'normal',
		fontSize : '22px',
		color : '#EEE',
	},
	separator : {
		fontWeight : 'bold',
		fontSize : '24px',
		margin : '0 2px',
		color : '#FFF',
	}
});

export default function H2({
	children,
}) {
	const classes = useStyles();
	let content;

	if (typeof children === 'string') {
		const parts = children.split('/');
		content = (
			<React.Fragment>
				{parts.map((elt, idx) => (
					<React.Fragment key={idx}>
						<span>{elt}</span>
						<span className={classes.separator}>/</span>
					</React.Fragment>
				))}
			</React.Fragment>
		);
	}
	else {
		content = children;
	}

	return (
		<h2 className={classes.h2}>{content}</h2>
	);
}
