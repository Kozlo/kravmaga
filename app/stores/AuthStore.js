import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);

        this.userId = localStorage.getItem('user_id');
        this.userIsAdmin = localStorage.getItem('user_is_admin') === 'true';
        this.token = localStorage.getItem('id_token');
    }

    onLoginUser(args) {
        const { user, token } = args;

        localStorage.setItem('user_id', user._id);
        localStorage.setItem('user_is_admin', user.is_admin);
        localStorage.setItem('id_token', token);

        this.userId = user._id;
        this.userIsAdmin = user.is_admin;
        this.token = token;

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
        localStorage.removeItem('user_is_admin');
        localStorage.removeItem('id_token');

        this.token = null;
        this.userId = null;

        browserHistory.replace('/login');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
