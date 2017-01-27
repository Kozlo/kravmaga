import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { browserHistory, Link } from 'react-router';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';

class NavigationBar extends React.Component {
    static getStores() {
        return [AuthStore];
    }

    static getPropsFromStores() {
        return AuthStore.getState();
    }

    navigateTo(path) {
        browserHistory.push(path);
    }

    onLogoutClicked() {
        AuthActions.logoutUser();
    }

    render() {
        const { userIsAdmin, token } = this.props;
        const isLoggedIn = !!token;
        const isAdmin = userIsAdmin === true;

        return (
            <Navbar staticTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to='/' className='navbar-brand'>Krav Maga</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav>
                    {isLoggedIn &&
                        <NavItem eventKey={1} onClick={this.navigateTo.bind(this, '/')}>
                            Profils
                        </NavItem>
                    }
                    {isLoggedIn && isAdmin &&
                        <NavItem eventKey={2} onClick={this.navigateTo.bind(this, '/admin')}>
                            Admin Panelis
                        </NavItem>
                    }
                </Nav>
                <Nav pullRight>
                    {isLoggedIn &&
                        <NavItem eventKey={1} onClick={this.onLogoutClicked.bind(this)}>
                            <Glyphicon glyph="log-out" /> Iziet
                        </NavItem>
                    }
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default connectToStores(NavigationBar);
