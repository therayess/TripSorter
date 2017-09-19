import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './components/Main';
import Landing from './components/Landing';

const route = (
	<Route name="Home" path='/' component={Main}>
		<IndexRoute name="Landing" component={Landing} />
	</Route>
)

module.exports = { route };
