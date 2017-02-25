import { browserHistory } from 'react-router';

import alt from '../alt';
import AuthActions from '../actions/AuthActions';

/**
 * Store for authentication-related data.
 */
class AuthStore {
    /**
     * Binds the authentication actions to event handlers.
     *
     * Assigns data stores in the browser's local storage.
     *
     * @public
     */
    constructor() {
        this.bindActions(AuthActions);

        this.userId = localStorage.getItem('userId');
        this.userIsAdmin = localStorage.getItem('userIsAdmin') === 'true';
        this.token = localStorage.getItem('token');
    }

    /**
     * User logged in handler.
     *
     * Sets local storage items and store properties based on the data returned from the API.
     * Redirects the user to the homepage.
     *
     * @public
     * @param {Object} args Data
     */
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

    /**
     * User logged out handler.
     *
     * Checks if the token and userId have been already removed.
     * If yes the user was already logged out and there's no need for another notification.
     *
     * @public
     */
    onLogoutUser() {
        const wasAlreadyLoggedOut = !this.token && !this.userId;

        this._logOutUser();

        if (!wasAlreadyLoggedOut) {
            toastr.success('Lietotājs izgājis veiksmīgi!');
        }
    }

    /**
     * User silent logged out handler.
     *
     * Skips the notification.
     *
     * @public
     */
    onSilentLogoutUser() {
        this._logOutUser();
    }

    /**
     * Removes localStorage items and store properties.
     *
     * @private
     */
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

export default alt.createStore(AuthStore);
