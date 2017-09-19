require('../sass/main.scss');

const React = require('react');
const ReactDOM = require('react-dom');
const ClientApp = require('./ClientApp');
const route = require('./route').route;
const ReactRouter = require('react-router');
const { browserHistory } = ReactRouter;
const { match } = ReactRouter;

match({ history: browserHistory, routes: route }, (error, redirectLocation, renderProps) => {
  if (error) {
    return console.error('BrowserEntry error', error);
  }
  
  ReactDOM.render(<ClientApp {...renderProps} />, document.getElementById('app'));
});
