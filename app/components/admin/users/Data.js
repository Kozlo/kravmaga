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

    submitHandler(isUpdating, groupList, userGroupIds, updatable, event) {
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
            this.update(updatable, groupList, userGroupIds, token);
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

    update(updatable, groupList, userGroupIds, token) {
        const props = prefixAdminFields(updatable);

        UserActions.update(props, token)
            .done(updatedUser => this._onUserUpdated(updatedUser._id, groupList, userGroupIds, token))
            .fail(() => UserActions.setIsRequesting(false));
    }

    create(updatable, userGroupIds, token) {
        const props = prefixAdminFields(updatable);

        UserActions.create(props, token)
            .done(createdUser => this._onUserCreated(createdUser._id, userGroupIds, token))
            .fail(() => UserActions.setIsRequesting(false));
    }

    /**
     * User updated event handler.
     *
     * Updates user store props, adds the user to the specified groups, removes from other groups.
     *
     * @private
     * @param {string} userId Created user ID
     * @param {Object[]} groupList All group list
     * @param {string[]} userGroupIds IDs of groups the user should be added to
     * @param {string} token Auth token
     */
    _onUserUpdated(userId, groupList, userGroupIds, token) {
        const removableUserGroupIds = this._findRemovableUserGroupIds(groupList, userGroupIds);

        UserActions.setIsRequesting(false);
        UserActions.setIsUpdating(false);

        this._removeUserFromGroups(userId, removableUserGroupIds, token);
        this._addUserToGroups(userId, userGroupIds, token)
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
    }

    /**
     * Removes the specified user from all of the groups in the list.
     *
     * @private
     * @param {string} userId User id
     * @param {string[]} removableUserGroupIds Group IDs where the user should be added to
     * @param {string} token Auth token
     */
    _removeUserFromGroups(userId, removableUserGroupIds, token) {
        removableUserGroupIds.forEach(removableUserGroupId => {
            GroupActions.removeMember(token, removableUserGroupId, userId);
        });
    }

    /**
     * Adds the specified user to all of the groups in the list.
     *
     * @private
     * @param {string} userId User id
     * @param {string[]} userGroupIds Group IDs where the user should be added to
     * @param {string} token Auth token
     */
    _addUserToGroups(userId, userGroupIds, token) {
        userGroupIds.forEach(userGroupId => {
            GroupActions.addMember(token, userGroupId, userId);
        });
    }

    /**
     * Finds group IDs of groups the user should be not added to.
     *
     * @private
     * @param {Object[]} groupList List of all groups
     * @param {string[]} userGroupIds Group IDs the user should be added to
     * @returns {string[]} List of group IDs that the user should be removed from
     */
    _findRemovableUserGroupIds(groupList, userGroupIds) {
        return groupList
            .filter(group => userGroupIds.indexOf(group._id) === -1)
            .map(group => group._id);
    }

    render() {
        const {
            list, groupList, userGroupIds,
            isUpdating, isCreating, updatable
        } = this.props;
        const shouldShow = isUpdating || isCreating;
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
                    submitHandler={this.submitHandler.bind(this, isUpdating, groupList, userGroupIds, updatable)}>
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
