import alt from '../alt';
import { httpStatusCode, fetchData } from '../utils/utils';

class AuthActions {
    constructor() {
        this.generateActions(
            'userLoggedIn',
            'logoutUser',
            'silentLogoutUser',
            'checkPasswordFailed',
        );
    }

    /**
     * Sends the passed credentials to the API to check if  they are valid.
     *
     * @public
     * @param {string} email User's email
     * @param {string} password User's password
     * @returns {Promise} Request promise
     */
    login(email, password) {
        const statusCode = $.extend({ 200: data => this.userLoggedIn(data) }, httpStatusCode);
        const request = {
            statusCode,
            data: { email, password },
            url: '/login',
            method: 'POST'
        };

        return fetchData(request);
    }

    /**
     * Checks if the passed user's password is correct.
     *
     * Overrides the forbidden (401) response as there's no need to logout.
     *
     * @public
     * @param {string} email User's email
     * @param {string} password User's password
     * @param {Function} successHandler Method to call on success
     * @param {Function} failHandler Method to call on auth fail
     * @returns {Promise} Request promise
     */
    checkPassword(email, password, successHandler, failHandler) {
        const statusCode = $.extend(
            { 200: data => successHandler(data) },
            httpStatusCode,
            { 401: () => failHandler() }
        );
        const request = {
            statusCode,
            data: { email, password },
            url: '/login',
            method: 'POST'
        };

        return fetchData(request);
    }
}

export default alt.createActions(AuthActions);
