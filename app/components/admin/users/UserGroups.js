// dependencies
import React from 'react';
import {
    Row, Col, Button,
    Well, Glyphicon, FormGroup,
    FormControl, ControlLabel
} from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import GroupActions from '../../../actions/GroupActions';

/**
 * User data presentation component.
 */
class UserData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Retrieves a list of exiting groups.
     * If the user is being updated, then a list of groups the user is in is updated as well.
     * Otherwise an empty array is added to avoid having the previous updatable user's groups.
     *
     * @public
     */
    componentDidMount() {
        const { token } = AuthStore.getState();
        const { isUpdating, updatable } = this.props;

        GroupActions.getList(token, UserActions.groupListReceived);

        if (isUpdating) {
            const filters = { members: updatable._id };

            GroupActions.getList(token, UserActions.userGroupsReceived, filters);
        } else {
            UserActions.userGroupsReceived([]);
        }
    }

    /**
     * Attempts to add the group ID to the list of group IDs if the user already isn't in the group.
     *
     * @public
     * @param {Object[]} groupList List of all available groups
     * @param {string[]} userGroupIds List of IDs the user is a member of
     * @param {Object} event Event object
     * @returns {*}
     */
    addUserGroupId(groupList, userGroupIds, event) {
        const userGroupId = event.target.value;

        if (!userGroupId) {
            return;
        }

        const groupName = this._findGroupName(groupList, userGroupId);

        if (userGroupIds.indexOf(userGroupId) > -1) {
            return toastr.error(`Lietotajs jau ir ${groupName} grupas biedrs!`);
        }

        UserActions.userGroupIdAdded(userGroupId);
    }

    /**
     * Remove a user from a list of groups he/she is in.
     *
     * @public
     * @param {string} userGroupId ID of the group the user should be removed from
     */
    removeUserGroupId(userGroupId) {
        UserActions.userGroupIdRemoved(userGroupId);
    }

    /**
     * Renders a select option with the group.
     *
     * @public
     * @param group
     * @param index
     * @returns {string} HTML markup
     */
    renderGroup(group, index) {
        const { _id, name } = group;

        return (
            <option
                key={`UserGroupOption${index}`}
                value={_id}>
                {name}
            </option>
        );
    }

    /**
     * Renders clickable user group names that removes the user from the group when clicked.
     *
     * @param {Object[]} groupList List of all groups
     * @param {string} userGroupId User group id
     * @param {number} index Index of the iterable
     * @returns {XML}
     */
    renderUserGroup(groupList, userGroupId, index) {
        const groupName = this._findGroupName(groupList, userGroupId);

        return (
            <Button
                key={`Group${index}`}
                bsSize="small"
                onClick={this.removeUserGroupId.bind(this, userGroupId)}>
                {groupName} <Glyphicon glyph="remove" />
            </Button>
        );
    }

    /**
     * Finds the name of the group with the specified ID.
     *
     * @private
     * @param {Object[]} groupList List of all groups
     * @param {string} userGroupId User group id
     * @returns {string}
     */
    _findGroupName(groupList, userGroupId) {
        return groupList
            .filter(group => group._id === userGroupId)
            .map(group => group.name)[0];
    }

    /**
     * Renders user group sections of user edit/create form.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { groupList, userGroupIds } = this.props;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Pievienot lietotāju grupai</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Pievienot grupu"
                                value=""
                                onChange={this.addUserGroupId.bind(this, groupList, userGroupIds)}>
                                <option value=''></option>
                                {groupList.map((group, index) => this.renderGroup(group, index))}}
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ControlLabel>Lietotāja grupas</ControlLabel>
                        <Well bsSize="small">
                            {userGroupIds.map((userGroupId, index) => this.renderUserGroup(groupList, userGroupId, index))}
                        </Well>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(UserData);
