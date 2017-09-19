require('babel-register');

var express = require('express');
var app = express();

//requiring local modeles
var configs = require('./config');

// serve client side code.
app.use('/', express.static('client'));

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router');
const match = ReactRouter.match;
const RouterContext = ReactRouter.RouterContext;
const _ = require('lodash');
const fs = require('fs');
const baseTemplate = fs.readFileSync('./client/index.html');
const template = _.template(baseTemplate);
const clientRoutes = require('./client/js/route.js').route;

// Handling server side rendering using ReactDomServer.renderToString
app.use((req, res) => {
  match({ routes: clientRoutes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      const body = ReactDOMServer.renderToString(
        React.createElement(RouterContext, renderProps)
      )
      res.status(200).send(template({body}))
    } else {
      res.status(404).send('Not found')
    }
  })
})

//Finally starting the listener
app.listen(configs.applicationPort, "0.0.0.0", function () {
  console.log('App listening on port '+ configs.applicationPort+'!');
});
