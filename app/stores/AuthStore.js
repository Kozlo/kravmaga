import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);

        const profile = localStorage.getItem('profile');

        this.isLoggedIn = !!localStorage.getItem('id_token');
        this.token = localStorage.getItem('id_token');
        this.profile = profile ? JSON.parse(profile) : {};
    }

    onLoginUser(args) {
        // TODO: figure out how to pass the args separately
        let profile = args[0];
        let token = args[1];

        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('id_token', token);
        this.isLoggedIn = true;
        this.token = token;
        this.profile = profile;
        browserHistory.replace('/');
        toastr.success('Lietotājs ienācis veiksmīgi!');
    }

    onLogoutUser() {
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
        this.isLoggedIn = false;
        browserHistory.replace('/login');
        toastr.success('Lietotājs izgājis veiksmīgi!');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
