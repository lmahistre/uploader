const React = require('react');
const ReactDOM = require('react-dom');
const Form = require('./components/form');

window.onload = function () {
	ReactDOM.render(
		React.createElement(Form, null), 
		document.getElementById('react-root')
	);
}
