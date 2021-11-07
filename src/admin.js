import React from 'react';
import { render } from 'react-dom';
import Admin from './components/admin';

window.onload = function () {
	render(
		React.createElement(Admin, null), 
		document.getElementById('react-root')
	);
};
