import React from 'react';
import { Link } from 'react-router';

class Header extends React.Component {
    render() {
        return (
            <header>
                <div className="container">
                    <Link to='/' className="site-logo">TripSorter</Link>
                    <div className="author">By Ammar Rayess</div>
                </div>
            </header>
        )
    }
}

module.exports = Header;
