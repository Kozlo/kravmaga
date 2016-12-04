// src/utils/AuthService.js

import Auth0Lock from 'auth0-lock';
import { browserHistory } from 'react-router';

// this is added as a workaround for server-side rendering
import ExecutionEnvironment from 'exenv';

export default class AuthService {
    constructor(clientId, domain) {
        this.initialized = false;
        this._clientId = clientId;
        this._domain = domain;

        this.initialize();

        // binds login functions to keep this context
        this.login = this.login.bind(this)
    }

    initialize() {
        if (!ExecutionEnvironment.canUseViewport || !document || !window || this.initialized) return;

        // Configure Auth0
        // TODO: change the localhost url to a configured one (or try using relative path if possible)
        this.lock = new Auth0Lock(this._clientId, this._domain, {
            auth: {
                redirectUrl: `${window.location.origin}/login`,
                responseType: 'token'
            }
        });
        // Add callback for lock `authenticated` event
        this.lock.on('authenticated', this._doAuthentication.bind(this));

        delete this._clientId;
        delete this._domain;

        this.initialized = true;
    }

    _doAuthentication(authResult) {
        if (!this.initialized) return;

        // Saves the user token
        this.setToken(authResult.idToken);
        // navigate to the home route
        browserHistory.replace('/');
    }

    login() {
        if (!this.initialized) return;

        // Call the show method to display the widget.
        this.lock.show();
    }

    loggedIn() {
        if (!this.initialized) return;

        // Checks if there is a saved token and it's still valid
        return !!this.getToken();
    }

    setToken(idToken) {
        if (!this.initialized) return;

        // Saves user token to local storage
        localStorage.setItem('id_token', idToken);
    }

    getToken() {
        if (!this.initialized) return;

        // Retrieves the user token from local storage
        return localStorage.getItem('id_token');
    }

    logout() {
        if (!this.initialized) return;

        // Clear user token and profile data from local storage
        localStorage.removeItem('id_token');

        // Navigate to home page
        browserHistory.replace('/');
    }
}