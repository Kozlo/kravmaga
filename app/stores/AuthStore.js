import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);

        this.token = localStorage.getItem('id_token');
        this.userId = localStorage.getItem('user_id');
    }

    onGetToken() {
        return this.token;
    }

    onAuthUserId() {
        return this.userId;
    }

    onLoginUser(args) {
        const { userId, token } = args;

        localStorage.setItem('user_id', userId);
        localStorage.setItem('id_token', token);

        this.token = token;
        this.userId = userId;

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
        localStorage.removeItem('user_id');
        localStorage.removeItem('id_token');

        this.token = null;
        this.userId = null;

        browserHistory.replace('/login');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
