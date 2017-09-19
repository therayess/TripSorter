import React from 'react';
import Header from './Header';

class Main extends React.Component {
	render() {
		return (
			<div>
				<Header {...this.props} />
				
				<main>{React.cloneElement(this.props.children, this.props)}</main>
			</div>
		)
	}
}

module.exports = Main;
