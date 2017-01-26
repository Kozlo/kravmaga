import alt from '../alt';
import { userFields } from '../utils/config';
import {
    httpStatusCode,
    httpSuccessHandler,
    httpErrorHandler,
    getAuthorizationHeader,
    encodeJsonUrl,
    createObject
} from '../utils/utils';

class UserActions {
    constructor() {
        this.generateActions(
            'getCurrentUser',
            'userReceived',
            'userDeleted',
            'userUpdated',
            'userUpdateConflict',
            'userListReceived',
            'setUpdatableUser'
        );
    }

    createUser(props, successHandler) {
        const statusCode = Object.assign({ 201: user => successHandler(user)}, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: '/users',
            method: 'POST',
            data: props,
        });
    }

    getUser(id, token) {
        const statusCode = Object.assign({ 200: user => this.userReceived(user) }, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users/${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token)
        });
    }

    getUserList(filters, token) {
        const statusCode = Object.assign({ 200: users => this.userListReceived(users)}, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users?filters=${encodeJsonUrl(filters)}`,
            method: 'GET',
            headers: getAuthorizationHeader(token)
        });
    }

    updateUser(user, token) {
        const statusCode = Object.assign(
            { 200: updatedUser => this.userUpdated(updatedUser) },
            httpStatusCode,
            { 409: () => this.userUpdateConflict() }
        );

        return this._sendRequest({
            statusCode,
            url: `/users/${user._id}`,
            method: 'PATCH',
            data: user,
            headers: getAuthorizationHeader(token)
        });
    }

    deleteUser(id, token) {
        const statusCode = Object.assign({ 200: (deletedUser) => this.userDeleted(deletedUser) }, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: `/users/${id}`,
            method: 'DELETE',
            headers: getAuthorizationHeader(token)
        });
    }

    /**
     * Creates and sets a new updatable user based on the passed user's properties.
     *
     * @param {Object} user User to take the properties from
     * @returns {Promise}
     */
    clearUpdatableUser(user, addAdminFields = false) {
        const { general, admin_fields } = userFields;
        const updatableUser = createObject(general, user);

        updatableUser.admin_fields = createObject(admin_fields, user.admin_fields);

        return this.setUpdatableUser(updatableUser);
    }

    _sendRequest(request) {
        return $.ajax(request)
            .done(data => httpSuccessHandler(data))
            .fail(error => httpErrorHandler(error));
    }
}

export default alt.createActions(UserActions);
