import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button } from 'react-bootstrap'

import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';

class Login extends React.Component {

    static getStores() {
        return [AuthStore];
    }

    static getPropsFromStores() {
        return AuthStore.getState();
    }

    componentDidMount() {
        this._initLock();
        // TODO: add auto popup opening
    }

    componentWillUnmount() {
        // TODO: research if I need to do anything here
    }

    login() {
        this._lock.show();
    }

    _initLock() {
        AuthActions.getAuthConfig(this._onAuthConfigReceived.bind(this));
    }

    _onAuthConfigReceived(authConfig) {
        this._lock = new Auth0Lock(authConfig.jwt_audience, authConfig.auth0_id, {
            auth: {
                redirectUrl: `${window.location.origin}/login`,
                responseType: 'token'
            }
        });

        // TODO: test if I need to get rid of this on componentWillUnmount
        this._lock.on('authenticated', authResult => this._onAuthenticated(authResult));
    }

    _onAuthenticated(authResult) {
        this._lock.getUserInfo(
            authResult.accessToken,
            (error, profile) => this._onProfileReceived(error, authResult.idToken, profile)
        );
    }

    _onProfileReceived(error, token, profile) {
        if (error) {
            console.error(error);
            toastr.error('Autorizācija neveiksmīga!');
            return;
        }

        AuthActions.checkProfile(token, profile);
    }

    render() {
        return (
            <div className='container'>
                <div className='text-center'>
                    <h2>Krav Maga</h2>
                    <Button className="btn btn-default btn-lg" onClick={this.login.bind(this)}>
                        <span className="glyphicon glyphicon-log-in"></span> Ienākt/Reģistrēties
                    </Button>
                </div>
            </div>
        );
    }
}

export default connectToStores(Login);
