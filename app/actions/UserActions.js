import alt from '../alt';
import {
    httpStatusCode,
    httpSuccessHandler,
    httpErrorHandler,
    objectIsEmpty,
    getAuthorizationHeader,
    encodeJsonUrl
} from '../utils/utils';

class UserActions {

    constructor() {
        this.generateActions(
            'userReceived',
            'getCurrentUser'
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

    getUser(id, token) {
        const statusCode = $.extend({ 200: user => this.userReceived(user) }, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users/${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token)
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

    // fetches the authenticated user if it hasn't been fetched already
    checkForUser(user, authUserId, token) {
        if (objectIsEmpty(user) && authUserId && token) {
            return this.getUser(authUserId, token);
        }

        return false;
    }

    _sendRequest(request) {
        return $.ajax(request)
            .done(data => httpSuccessHandler(data))
            .fail(error => httpErrorHandler(error));
    }

}

export default alt.createActions(UserActions);
