import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        const profile = localStorage.getItem('profile');

        this.bindActions(AuthActions);

        this.isLoggedIn = !!localStorage.getItem('id_token');
        this.token = localStorage.getItem('id_token');
        this.profile = profile ? JSON.parse(profile) : {};
    }

    onGetToken() {
        return this.token;
    }

    onLoginUser(args) {
        const [profile, token] = args;

        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('id_token', token);

        this.isLoggedIn = true;
        this.token = token;
        this.profile = profile;

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
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');

        this.isLoggedIn = false;

        browserHistory.replace('/login');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
