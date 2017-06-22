// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import GroupActions from '../../../actions/GroupActions';

// components
import UserEntry from './Entry';
import ManageUser from '../../shared/users/ManageUser';
import UserFields from '../../shared/users/UserFields';
import AdminUserFields from './AdminUserFields';
import PasswordChange from '../../shared/users/PasswordChange';
import UserGroups from './UserGroups';

// utils and config
import {
    isEmailValid, isUrlValid,
    prefixAdminFields
} from '../../../utils/utils';
import {
    generalConfig, userDataColumns
} from '../../../utils/config';

class UserData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Gets the list of users.
     *
     * @public
     */
    componentDidMount() {
        const { token } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        UserActions.getList(token, UserActions.listReceived, filters, sorters, config);
    }

    /**
     * Modal closed handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the user is being updated
     */
    closeHandler(isUpdating) {
        if (isUpdating) {
            UserActions.setIsUpdating(false);
        } else {
            UserActions.setIsCreating(false);
        }
    }

    /**
     * Submit handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing is the user is being updated
     * @param {string[]} userGroupIds List of group IDs the user is in
     * @param {Object} updatable Updatable object
     * @param {Object} event Event object
     * @returns {*}
     */
    submitHandler(isUpdating, userGroupIds, updatable, event) {
        event.preventDefault();

        const userDataValid = this._validateUserData(updatable);

        if (!userDataValid) {
            return;
        }

        const { token } = AuthStore.getState();

        UserActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, userGroupIds, token);
        } else {
            this.create(updatable, userGroupIds, token);
        }
    }

    /**
     * Initiates creation of a new user.
     *
     * Sets the updatable user object with empty values.
     *
     * @public
     */
    initCreate() {
        const { defaultUserRole } = generalConfig;
        const newUser = {
            admin_fields: {
                role: defaultUserRole,
                is_blocked: false
            }
        };

        UserActions.clearUpdatable(newUser);
        UserActions.setIsCreating(true);
    }

    /**
     * Updates an existing user.
     *
     * @public
     * @param {Object} updatable Updatable user
     * @param {string[]} userGroupIds IDs of groups the user is in
     * @param {string} token Authentication token
     */
    update(updatable, userGroupIds, token) {
        const props = prefixAdminFields(updatable);

        UserActions.update(props, token)
            .done(updatedUser => this._onUserUpdated(updatedUser._id, userGroupIds, token))
            .fail(() => UserActions.setIsRequesting(false));
    }

    /**
     * Creates a new user.
     *
     * @public
     * @param {Object} updatable Updatable user
     * @param {string[]} userGroupIds IDs of groups the user is in
     * @param {string} token Authentication token
     */
    create(updatable, userGroupIds, token) {
        const props = prefixAdminFields(updatable);

        UserActions.create(props, token)
            .done(createdUser => this._onUserCreated(createdUser._id, userGroupIds, token))
            .fail(() => UserActions.setIsRequesting(false));
    }

    /**
     * Validates user email and picture (if entered).
     *
     * @private
     * @param {Object} updatable Updatable
     * @returns {boolean}
     */
    _validateUserData(updatable) {
        const { email, picture } = updatable;

        if (!isEmailValid(email)) {
            toastr.error('E-pasts ievadīts kļūdaini!');
            return false;
        }

        if (!isUrlValid(picture) && picture !== '') {
            toastr.error('Profila bildes saitei nav derīga!');
            return false;
        }

        return true;
    }

    /**
     * User created event handler.
     *
     * Updates user store props and adds the user to the specified groups.
     *
     * @private
     * @param {string} userId Created user ID
     * @param {string[]} userGroupIds IDs of groups the user should be added to
     * @param {string} token Auth token
     */
    _onUserCreated(userId, userGroupIds, token) {
        UserActions.setIsCreating(false);
        UserActions.setIsRequesting(false);

        this._addUserToGroups(userId, userGroupIds, token);
    }

    /**
     * User updated event handler.
     *
     * Updates user store props, adds the user to the specified groups, removes from other groups.
     *
     * @private
     * @param {string} userId Created user ID
     * @param {string[]} userGroupIds IDs of groups the user should be added to
     * @param {string} token Auth token
     */
    _onUserUpdated(userId, userGroupIds, token) {
        const groupFilters = { members: userId };
        const groupListReceivedHandler = this._onExistingUserGroupsRetrieved.bind(this, userId, userGroupIds, token);

        UserActions.setIsRequesting(false);
        UserActions.setIsUpdating(false);
        GroupActions.getList(token, groupListReceivedHandler, groupFilters);
    }

    /**
     * Determines which groups the user should be added to and which ones removed from.
     *
     * Calls the methods to update lesson and groups stores as their values might have changed now.
     *
     * @private
     * @param {string} userId ID of the user being edited
     * @param {string[]} newUserGroupIds List of IDs of groups the use should be a member of
     * @param {string} token Authorization token
     * @param {Object[]} currentUserGroupList List of groups the user is currently in
     */
    _onExistingUserGroupsRetrieved(userId, newUserGroupIds, token, currentUserGroupList) {
        const currentUserGroupIds = currentUserGroupList.map(group => group._id);
        const removableUserGroupIds = this._findRemovableUserGroupIds(currentUserGroupIds, newUserGroupIds);
        const addableUserGroupIds = this._findAddableUserGroupIds(currentUserGroupIds, newUserGroupIds);

        this._removeUserFromGroups(userId, removableUserGroupIds, token)
            .then(() => this._addUserToGroups(userId, addableUserGroupIds, token));
    }

    /**
     * Adds the specified user to all of the groups in the list.
     *
     * @private
     * @param {string} userId User id
     * @param {string[]} addableUserGroupIds Group IDs where the user should be added to
     * @param {string} token Auth token
     */
    _addUserToGroups(userId, addableUserGroupIds, token) {
        return GroupActions.addUserToGroups(token, userId, addableUserGroupIds);
    }

    /**
     * Removes the specified user from all of the groups in the list.
     *
     * @private
     * @param {string} userId User id
     * @param {string[]} removableUserGroupIds Group IDs where the user should be added to
     * @param {string} token Auth token
     * @returns {Promise} Request promise
     */
    _removeUserFromGroups(userId, removableUserGroupIds, token) {
        return GroupActions.removeUserFromGroups(token, userId, removableUserGroupIds);
    }

    /**
     * Finds group IDs of groups the user should be removed from.
     *
     * If any of the existing group IDs is not in the list of the new ones, it should be removed.
     *
     * @private
     * @param {string[]} currentUserGroupIds List of IDs of all groups the user is currently in
     * @param {string[]} newUserGroupIds List of IDs of all groups the user should now be in
     * @returns {string[]} List of group IDs that the user should be removed from
     */
    _findRemovableUserGroupIds(currentUserGroupIds, newUserGroupIds) {
        return currentUserGroupIds.filter(existingGroupId => newUserGroupIds.indexOf(existingGroupId) === -1);
    }

    /**
     * Finds group IDs of groups the user should be added to.
     *
     * If any of the new group IDs is not in the list of the existing ones, it should be added.
     *
     * @private
     * @param {string[]} currentUserGroupIds List of IDs of all groups the user is currently in
     * @param {string[]} newUserGroupIds List of IDs of all groups the user should now be in
     * @returns {string[]} List of group IDs that the user should be removed from
     */
    _findAddableUserGroupIds(currentUserGroupIds, newUserGroupIds) {
        return newUserGroupIds.filter(newUserGroupId => currentUserGroupIds.indexOf(newUserGroupId) === -1);
    }

    /**
     * Renders user data in a table format.
     *
     * @returns {string} HTML markup
     */
    render() {
        const {
            list, userGroupIds, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;

        return (
            <Row>
                <Col xs={12}>
                    <Button
                        bsStyle="success"
                        onClick={this.initCreate.bind(this)}>
                        Izveidot
                    </Button>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{userDataColumns.map((col, index) => <th key={`UserTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                            {list.map((user, index) => <UserEntry key={`UserEntry${index}`} index={index} user={user} />)}
                        </tbody>
                    </Table>
                </Col>
                <ManageUser
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, userGroupIds, updatable)}>
                    <UserFields />
                    <AdminUserFields />
                    <UserGroups />
                </ManageUser>
                <PasswordChange checkPass={false} />
            </Row>
        );
    }
}

export default connectToStores(UserData);
