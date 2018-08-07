const React = require('react');
const ReactDOM = require('react-dom');
const Form = require('./form.jsx');

window.onload = function () {
	ReactDOM.render(
		React.createElement(Form, null), 
		document.getElementById('react-root')
	);
}
