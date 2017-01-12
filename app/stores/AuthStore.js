import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);

        this.token = localStorage.getItem('id_token');
        this.authUserId = localStorage.getItem('auth_user_id');
    }

    onGetToken() {
        return this.token;
    }

    onAuthUserId() {
        return this.authUserId;
    }

    onLoginUser(args) {
        const { authUserId, token } = args;

        localStorage.setItem('auth_user_id', authUserId);
        localStorage.setItem('id_token', token);

        this.token = token;
        this.authUserId = authUserId;

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
        localStorage.removeItem('auth_user_id');
        localStorage.removeItem('id_token');

        this.token = null;
        this.authUserId = null;

        browserHistory.replace('/login');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
