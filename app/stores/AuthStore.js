import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);

        this.isLoggedIn = typeof localStorage !== 'undefined' ? !!localStorage.getItem('id_token') : false;
    }

    onLoginUser(authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        this.isLoggedIn = true;
        browserHistory.replace('/profile');
        toastr.success('Lietotājs ienācis veiksmīgi!');
    }

    // TODO: add user name here as arg
    onLogoutUser() {
        localStorage.removeItem('id_token');
        this.isLoggedIn = false;
        browserHistory.replace('/');
        toastr.success('Lietotājs izgājis veiksmīgi!');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
