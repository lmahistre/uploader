const React = require('react');
const ReactDOM = require('react-dom');
const Main = require('./components/main');

window.onload = function () {
	ReactDOM.render(
		React.createElement(Main, null), 
		document.getElementById('react-root')
	);
};
