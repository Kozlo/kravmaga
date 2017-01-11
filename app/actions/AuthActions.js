import alt from '../alt';
import { httpStatusCode, httpSuccessHandler, httpErrorHandler, getAuthorizationHeader } from '../utils/utils';

class AuthActions {

    constructor() {
        this.generateActions(
            'getToken',
            'getUser',
            'loginUser',
            'logoutUser',
            'silentLogoutUser'
        );
    }

    getAuthConfig(successHandler) {
        const statusCode = $.extend({ 200: users => successHandler(users)}, httpStatusCode);
        const request = {
            statusCode,
            url: '/auth-config',
            method: 'GET'
        };

        return $.ajax(request)
            .done(data => httpSuccessHandler(data))
            .fail(e => httpErrorHandler(e));
    }

    checkProfile(token, profile) {
        const statusCode = $.extend({ 200: user => this.loginUser({ user, token}) }, httpStatusCode);
        const request = {
            statusCode,
            data: profile,
            headers: getAuthorizationHeader(token),
            url: '/check-profile',
            method: 'POST'
        };

        return this._sendRequest(request);
    }

    _sendRequest(request) {
        return $.ajax(request)
            .done(data => httpSuccessHandler(data))
            .fail(e => httpErrorHandler(e));
    }

}

export default alt.createActions(AuthActions);
