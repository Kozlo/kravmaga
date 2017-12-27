import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { browserHistory, Link } from 'react-router';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';

/**
 * Navigation bar.
 */
class NavigationBar extends React.Component {
    static getStores() {
        return [AuthStore];
    }

    static getPropsFromStores() {
        return AuthStore.getState();
    }

    /**
     * Navigates to the specified path.
     *
     * Uses 'push' rather than 'replace' in order to leave the previous route in history.
     *
     * @public
     * @param {string} path Path to navigate to
     */
    navigateTo(path) {
        browserHistory.push(path);
    }

    /**
     * Logs the user out.
     *
     * @public
     */
    onLogoutClicked() {
        AuthActions.logoutUser();
    }

    /**
     * Renders the naviation bar.
     *
     * Shows an additional 'profile' item when the user is logged in.
     * Shows a link to the admin panel is the user is an admin.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { userIsAdmin, token } = this.props;
        const isLoggedIn = !!token;
        const isAdmin = userIsAdmin === true;

        return (
            <Navbar staticTop={true} fluid={true}>
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
                        <NavItem eventKey={2} onClick={this.navigateTo.bind(this, '/admin/payments')}>
                            Maksājumi
                        </NavItem>
                    }
                    {isLoggedIn && isAdmin &&
                        <NavItem eventKey={3} onClick={this.navigateTo.bind(this, '/admin/lessons')}>
                            Nodarbības
                        </NavItem>
                    }
                    {isLoggedIn && isAdmin &&
                        <NavItem eventKey={4} onClick={this.navigateTo.bind(this, '/admin/users')}>
                            Lietotāji
                        </NavItem>
                    }
                    {isLoggedIn && isAdmin &&
                        <NavItem eventKey={5} onClick={this.navigateTo.bind(this, '/admin/groups')}>
                            Grupas
                        </NavItem>
                    }
                    {isLoggedIn && isAdmin &&
                        <NavItem eventKey={6} onClick={this.navigateTo.bind(this, '/admin/data')}>
                            Dati
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
