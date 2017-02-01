import alt from '../alt';
import { userFieldNames } from '../utils/config';
import {
    httpStatusCode,
    fetchData,
    getAuthorizationHeader,
    encodeJsonUrl,
    createObject,
    prefixAdminFields,
} from '../utils/utils';

class UserActions {
    constructor() {
        this.generateActions(
            'getCurrentUser',
            'userCreated',
            'userReceived',
            'userDeleted',
            'userUpdated',
            'userUpdateConflict',
            'userListReceived',
            'setUpdatableUser',
            'setIsUpdating',
            'setIsCreating',
            'setIsChangingPassword',
            'setIsRequesting',
        );
    }

    createUser(props, token) {
        const statusCode = Object.assign({ 201: user => this.userCreated(user)}, httpStatusCode);

        props = prefixAdminFields(props);

        const newUser = Object.assign({}, props);

        delete newUser._id;

        return fetchData({
            statusCode,
            url: '/users',
            method: 'POST',
            data: newUser,
            headers: getAuthorizationHeader(token),
        });
    }

    getUser(id, token) {
        const statusCode = Object.assign({ 200: user => this.userReceived(user) }, httpStatusCode);

        return fetchData({
            statusCode,
            url: `/users/${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    getUserList(filters, token) {
        const statusCode = Object.assign({ 200: users => this.userListReceived(users)}, httpStatusCode);

        // TODO: add prefixed (dot notation) fields

        return fetchData({
            statusCode,
            url: `/users?filters=${encodeJsonUrl(filters)}`,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    updateUser(props, token) {
        const statusCode = Object.assign(
            { 200: updatedUser => this.userUpdated(updatedUser) },
            httpStatusCode,
            { 409: () => this.userUpdateConflict() }
        );

        props = prefixAdminFields(props);

        return fetchData({
            statusCode,
            url: `/users/${props._id}`,
            method: 'PATCH',
            data: props,
            headers: getAuthorizationHeader(token)
        });
    }

    deleteUser(id, token) {
        const statusCode = Object.assign({ 200: (deletedUser) => this.userDeleted(deletedUser) }, httpStatusCode);

        return fetchData({
            statusCode,
            url: `/users/${id}`,
            method: 'DELETE',
            headers: getAuthorizationHeader(token),
        });
    }

    /**
     * Creates and sets a new updatable user based on the passed user's properties.
     *
     * @param {Object} user User to take the properties from
     * @returns {Promise}
     */
    clearUpdatableUser(user) {
        const { general, admin_fields } = userFieldNames;
        const updatableUser = createObject(general, user);

        updatableUser.admin_fields = createObject(admin_fields, user.admin_fields || {});

        return this.setUpdatableUser(updatableUser);
    }
}

export default alt.createActions(UserActions);
