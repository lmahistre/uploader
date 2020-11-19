const React = require('react');
const ReactDOM = require('react-dom');
const Admin = require('./components/admin');

window.onload = function () {
	ReactDOM.render(
		React.createElement(Admin, null), 
		document.getElementById('react-root')
	);
};
