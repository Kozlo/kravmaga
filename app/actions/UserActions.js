import alt from '../alt';
import { httpStatusCode, httpSuccessHandler, httpErrorHandler, getAuthorizationHeader, encodeJsonUrl } from '../utils/utils';

class UserActions {

    constructor() {
        this.generateActions(
            'userReceived'
        );
    }

    createUser(profile, successHandler) {
        const statusCode = $.extend({ 200: user => successHandler(user)}, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: '/users',
            method: 'POST',
            data: profile,
        });
    }

    getUsers(filters, successHandler) {
        const statusCode = $.extend({ 200: config => successHandler(config)}, httpStatusCode);

        // TODO: add filters
        return this._sendRequest({
            statusCode,
            url: `/users?filters=${encodeJsonUrl(filters)}`,
            method: 'GET',
            headers: getAuthorizationHeader()
        });
    }

    getUser(id, token) {
        const statusCode = $.extend({ 200: user => this.userReceived(user) }, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users/${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token)
        });
    }

    _sendRequest(request) {
        return $.ajax(request)
            .done(data => httpSuccessHandler(data))
            .fail(error => httpErrorHandler(error));
    }

}

export default alt.createActions(UserActions);
