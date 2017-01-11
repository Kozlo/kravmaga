import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        const user = localStorage.getItem('user');

        this.bindActions(AuthActions);

        this.isLoggedIn = !!localStorage.getItem('id_token');
        this.token = localStorage.getItem('id_token');
        this.user = user ? JSON.parse(user) : {};
    }

    onGetToken() {
        return this.token;
    }

    onGetUser() {
        return this.user;
    }

    onLoginUser(args) {
        const { user, token } = args;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('id_token', token);

        this.isLoggedIn = true;
        this.token = token;
        this.user = user;

        browserHistory.replace('/');

        toastr.success('Lietotājs ienācis veiksmīgi!');
    }

    onLogoutUser() {
        this._logOutUser();

        toastr.success('Lietotājs izgājis veiksmīgi!');
    }

    onSilentLogoutUser() {
        this._logOutUser();
    }

    _logOutUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('id_token');

        this.isLoggedIn = false;

        browserHistory.replace('/login');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
