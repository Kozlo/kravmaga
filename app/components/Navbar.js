import React from 'react';
//import connectToStores from 'alt-utils/lib/connectToStores';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = AuthStore.getState();
    }

    componentDidMount() {
        AuthStore.listen(this.onChange.bind(this));
    }

    componentWillUnmount() {
        AuthStore.unlisten(this.onChange.bind(this));
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        const { isLoggedIn } = this.state;

        return (
            <nav className='navbar navbar-default navbar-static-top'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link to='/profile' className='navbar-brand'>Krav Maga</Link>
                </div>
                <div id='navbar' className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        {isLoggedIn && <li><Link to='/profile'>Profils</Link></li>}
                    </ul>
                    {isLoggedIn &&
                        <Button className="btn btn-default navbar-btn pull-right" onClick={AuthActions.logoutUser.bind(this)}>
                            <span className="glyphicon glyphicon-log-out"></span> Iziet
                        </Button>
                    }
                </div>
            </nav>
        );
    }
}

export default Navbar;