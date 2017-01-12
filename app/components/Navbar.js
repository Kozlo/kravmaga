import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import AuthStore from '../stores/AuthStore';
import UserStore from '../stores/UserStore';

import AuthActions from '../actions/AuthActions';
import UserActions from '../actions/UserActions';

import { objectIsEmpty } from '../utils/utils';

class Navbar extends React.Component {

    static getStores() {
        return [AuthStore, UserStore];
    }

    static getPropsFromStores() {
        return {
            auth: AuthStore.getState(),
            user: UserStore.getState()
        }
    }

    componentDidMount() {
        const { user } = this.props.user;
        const { authUserId, token } = this.props.auth;

        UserActions.checkForUser(user, authUserId, token);
    }

    render() {
        const { user, auth } = this.props;
        const isLoggedIn = !!auth.token;
        const isAdmin = user.user.is_admin === true;
        const logoutBtnStyle = { marginRight: '15px' };

        return (
            <nav className='navbar navbar-default navbar-static-top'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link to='/' className='navbar-brand'>Krav Maga</Link>
                </div>
                <div id='navbar' className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        {isLoggedIn && <li><Link activeClassName="active" to='/'>Profils</Link></li>}
                        {isLoggedIn && isAdmin && <li><Link activeClassName="active" to='/admin'>Admin Panelis</Link></li>}
                    </ul>
                    {isLoggedIn &&
                        <Button className="btn btn-default navbar-btn pull-right" onClick={AuthActions.logoutUser.bind(this)} style={logoutBtnStyle} >
                            <span className="glyphicon glyphicon-log-out"></span> Iziet
                        </Button>
                    }
                </div>
            </nav>
        );
    }
}

export default connectToStores(Navbar);