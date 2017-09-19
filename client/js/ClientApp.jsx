import React from 'react';
import { Router } from 'react-router';
import { browserHistory } from 'react-router';
import { route } from './route';

class ClientApp extends React.Component {
  render () {
    return (
		<Router routes={route} history={browserHistory} />
    )
  }
}

module.exports = ClientApp;
