// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';

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
    prefixAdminFields, updateStoreList
} from '../../../utils/utils';
import { generalConfig } from '../../../utils/config';

class UserData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        UserActions.getList(token, UserActions.listReceived, filters, sorters, config);
    }

    closeHandler(isUpdating) {
        if (isUpdating) {
            UserActions.setIsUpdating(false);
        } else {
            UserActions.setIsCreating(false);
        }
    }

    submitHandler(isUpdating, userGroupIds, updatable, event) {
        event.preventDefault();

        const { token } = AuthStore.getState();
        const { email, picture } = updatable;

        if (!isEmailValid(email)) {
            return toastr.error('E-pasts ievadīts kļūdaini!');
        }

        if (!isUrlValid(picture) && picture !== '') {
            return toastr.error('Profila bildes saitei nav derīga!');
        }

        UserActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, userGroupIds, token);
        } else {
            this.create(updatable, userGroupIds, token);
        }
    }

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

    update(updatable, userGroupIds, token) {
        const props = prefixAdminFields(updatable);

        UserActions.update(props, token)
            .done(updatedUser => this._onUserUpdated(updatedUser._id, userGroupIds, token))
            .fail(() => UserActions.setIsRequesting(false));
    }

    create(updatable, userGroupIds, token) {
        const props = prefixAdminFields(updatable);

        UserActions.create(props, token)
            .done(createdUser => this._onUserCreated(createdUser._id, userGroupIds, token))
            .fail(() => UserActions.setIsRequesting(false));
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

        this._addUserToGroups(userId, userGroupIds, token)
            .then(() => updateStoreList(GroupStore, GroupActions));
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
            .then(() => this._addUserToGroups(userId, addableUserGroupIds, token))
            .then(() => {
                updateStoreList(LessonStore, LessonActions);
                updateStoreList(GroupStore, GroupActions);
            });
    }

    /**
     * Adds the specified user to all of the groups in the list.
     *
     * @private
     * @param {string} userId User id
     * @param {string[]} addableUserGroupIds Group IDs where the user should be added to
     * @param {string} token Auth token
     * @return {Promise} Request promise
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
     * @return {Promise} Request promise
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

    render() {
        const {
            list, userGroupIds, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        // TODO: consider moving thees to config (and in other similar components as well) maybe consider moving all strings to a separate file as well
        const columns = ['#', 'Bilde', 'Vārds, Uzvārds', 'E-pasts', 'Telefons', 'Dzimis', 'Dzimums', 'Klubā kopš', 'Statuss', 'Loma', 'Darbības'];

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
                            <tr>{columns.map((col, index) => <th key={`UserTableHeader${index}`}>{col}</th>)}</tr>
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
