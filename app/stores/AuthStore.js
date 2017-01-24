import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

class AuthStore {
    constructor() {
        this.bindActions(AuthActions);

        this.userId = localStorage.getItem('userId');
        this.userIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
        this.token = localStorage.getItem('token');
    }

    onUserLoggedIn(args) {
        const { user, token } = args;
        const userIsAdmin = user.admin_fields.role === 'admin';

        localStorage.setItem('userId', user._id);
        localStorage.setItem('userIsAdmin', userIsAdmin);
        localStorage.setItem('token', token);

        this.userId = user._id;
        this.userIsAdmin = userIsAdmin;
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
        localStorage.removeItem('userId');
        localStorage.removeItem('userIsAdmin');
        localStorage.removeItem('token');

        this.token = null;
        this.userId = null;
        this.userIsAdmin = null;

        browserHistory.replace('/login');
    }
}

export default alt.createStore(AuthStore, 'AuthStore');
