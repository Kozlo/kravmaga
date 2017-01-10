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
        // TODO: test if this is needed (probably isn't)
        if (typeof this._lock === 'undefined') {
            console.error('Lock is undefined');
            return;
        }

        this._lock.show();
    }

    _initLock() {
        // TODO: test if this is needed (probably isn't)
        if (this._lock) return;

        // TODO: add an auth action to get the config via a request
        const request = {
            url: '/get-auth0-config',
            method: 'POST',
            // TODO: move these to the utils class (but create a new object (see Expensio))
            statusCode: {
                200: res => {
                    console.log('Environmental variables retrieved successfully');
                    // initialize
                    this._lock = new Auth0Lock(res.jwt_audience, res.auth0_id, {
                        auth: {
                            redirectUrl: `${window.location.origin}/login`,
                            responseType: 'token'
                        }
                    });

                    this._lock.on('authenticated', authResult => this._onAuthenticated(authResult));
                },
                500: res => {
                    console.error(res);
                    toastr.error('Servera kļūda - mēģiniet vēlreiz!');
                }
            }
        };
        $.ajax(request)
            .fail(e => {
                // skip the error codes that have been handled
                const handledStatuses = Object.keys(request.statusCode);
                const indexOfStatus = handledStatuses.indexOf(e.status.toString());
                if (indexOfStatus !== -1) return;

                console.error(e);
                toastr.error('Servera kļūda - mēģiniet vēlreiz!');
            });
    }


    _onAuthenticated(authResult) {
        // TODO: remove when done developing
        console.log('Authresult: ', authResult);
        this._lock.getUserInfo(
            authResult.accessToken,
            (error, profile) => this._onProfileReceived(error, profile, authResult.idToken)
        );
    }

    _onProfileReceived(error, profile, token) {
        if (error) {
            console.error(error);
            toastr.error('Autorizācija neveiksmīga!');
            return;
        }

        // TODO: relace with a callto getUsers instead
        // TODO: test what kind of response is received when logging and what when registering via auth0 and see if it can be differentiated here
        const request = {
            url: '/check-profile',
            method: 'POST',
            data: profile,
            headers: { 'Authorization': `Bearer ${token}` },
            // TODO: move these to the utils class (but create a new object (see Expensio))
            statusCode: {
                200: res => {
                    console.log('Authorization successful');
                    AuthActions.loginUser(profile, token);
                },
                401: res => {
                    console.error(res);
                    toastr.error('Autorizācijas kļūda - mēģiniet vēlreiz!');
                },
                403: res => {
                    console.error(res);
                    toastr.error('Lietotājs bloķēts - Sazinieties ar administratoru!');
                },
                500: res => {
                    console.error(res);
                    toastr.error('Servera kļūda - mēģiniet vēlreiz!');
                }
            }
        };
        $.ajax(request)
            .done(data => {
                console.log('Data returned from the server: ', data);
            })
            .fail(e => {
                // skip the error codes that have been handled
                const handledStatuses = Object.keys(request.statusCode);
                const indexOfStatus = handledStatuses.indexOf(e.status.toString());
                if (indexOfStatus !== -1) return;

                console.error(e);
                toastr.error('Autorizācija neveiksmīga - neparadzēta kļūda!');
            });
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
