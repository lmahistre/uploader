import React from 'react';
import { render } from 'react-dom';
import Main from './components/main';

window.onload = function () {
	render(
		React.createElement(Main, null), 
		document.getElementById('react-root')
	);
};
