import { StyleSheet, css } from 'aphrodite/no-important';
import React from 'react';

import ClockIcon from '../svg/clock.svg';

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

export default function Loader() {
	return (
		<div className={css(styles.container)}>
			<ClockIcon className={css(styles.icon)} />
		</div>
	);
}
