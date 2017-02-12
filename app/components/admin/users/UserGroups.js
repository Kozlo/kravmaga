// dependencies
import React from 'react';
import {
    Row, Col, Button, Well, Glyphicon,
    FormGroup, FormControl, ControlLabel
} from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import GroupActions from '../../../actions/GroupActions';

class UserData extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    componentDidMount() {
        const { token } = AuthStore.getState();
        const { isUpdating, updatable } = this.props;
        const filters = isUpdating ? { members: updatable._id } : {};

        GroupActions.getList(token, {}, UserActions.groupListReceived);
        GroupActions.getList(token, filters, UserActions.userGroupsReceived);
    }

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

    removeUserGroupId(userGroupId) {
        UserActions.userGroupIdRemoved(userGroupId);
    }

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

    render() {
        const { groupList, userGroupIds } = this.props;

        return (
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
                <Col xs={12}>
                    <ControlLabel>Lietotāja grupas</ControlLabel>
                    <Well bsSize="small">
                        {userGroupIds.map((userGroupId, index) => this.renderUserGroup(groupList, userGroupId, index))}
                    </Well>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(UserData);
