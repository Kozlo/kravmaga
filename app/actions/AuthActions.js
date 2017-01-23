import alt from '../alt';
import { httpStatusCode, httpSuccessHandler, httpErrorHandler } from '../utils/utils';

class AuthActions {
    constructor() {
        this.generateActions(
            'loginUser',
            'logoutUser',
            'silentLogoutUser',
        );
    }

    login(email, password) {
        const statusCode = $.extend({ 200: data => this.loginUser(data) }, httpStatusCode);
        const request = {
            statusCode,
            data: { email, password },
            url: '/login',
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
