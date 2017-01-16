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
            'getCurrentUser',
            'userReceived',
            'userDeleted',
            'userUpdated',
            'userListReceived',
            'setUpdatableUser',
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

    getUserList(filters, token) {
        const statusCode = $.extend({ 200: users => this.userListReceived(users)}, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users?filters=${encodeJsonUrl(filters)}`,
            method: 'GET',
            headers: getAuthorizationHeader(token)
        });
    }

    updateUser(user, token) {
        const statusCode = $.extend({ 200: updatedUser => this.userUpdated(updatedUser) }, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users/${user._id}`,
            method: 'PATCH',
            data: user,
            headers: getAuthorizationHeader(token)
        });
    }

    deleteUser(id, token) {
        const statusCode = $.extend({ 200: (deletedUser) => this.userDeleted(deletedUser) }, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users/${id}`,
            method: 'DELETE',
            headers: getAuthorizationHeader(token)
        });
    }

    checkForUser(user, userId, token) {
        if (objectIsEmpty(user) && userId && token) {
            return this.getUser(userId, token);
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
