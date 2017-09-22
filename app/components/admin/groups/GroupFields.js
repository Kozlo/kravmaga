import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Button, Row, Col, Well,
    FormGroup, FormControl,
    ControlLabel, Glyphicon
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';
import UserActions from '../../../actions/UserActions';

import { maxInputLength } from '../../../utils/config';
import { constructUserInfo } from '../../../utils/utils';

/**
 * Group field update form control component.
 */
class GroupFields extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return GroupStore.getState()
    }

    /**
     * Retrieved group members (i.e. user data)
     *
     * @public
     */
    componentWillMount() {
        const { token } = AuthStore.getState();

        UserActions.getList(token, this._userListReceived.bind(this));
    }

    /**
     * Property value changed handler.
     *
     * @public
     * @param {string} prop Property name
     * @param {Object} event Event object
     */
    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        GroupActions.setUpdatable(updatable);
    }

    /**
     * Adds a member to a group.
     *
     * @public
     * @param {Object} updatable Updatable obejct
     * @param {Object} event Event object
     * @returns {*}
     */
    addMember(updatable, event) {
        const userId = event.target.value;

        if (!userId) {
            return;
        }

        if (updatable.members.indexOf(userId) > -1) {
            return toastr.error('Lietotājs jau grupai ir pievienots');
        }

        const user = this.props.userList.filter(user => user._id === userId)[0];

        updatable.members.push(userId);

        GroupActions.setUpdatable(updatable);
        GroupActions.memberAdded(user)
    }

    /**
     * Removes a member group a group.
     *
     * @public
     * @param {Object} updatable Updatable object
     * @param {Object} member Group member
     */
    removeMember(updatable, member) {
        const memberIndex = updatable.members.indexOf(member._id);

        updatable.members.splice(memberIndex, 1);

        GroupActions.setUpdatable(updatable);
        GroupActions.memberRemoved(member);
    }

    /**
     * Renders a user select option.
     *
     * @public
     * @param {Object} user User to select
     * @param {number} index User index
     * @returns {string} HTML markup
     */
    renderUser(user, index) {
        const { _id, given_name, family_name, email } = user;
        const userInfo = constructUserInfo(email, given_name, family_name);

        return (
            <option
                key={`UserOption${index}`}
                value={_id}>
                {userInfo}
            </option>
        );
    }

    /**
     * Renders a button with the user's info and adds a click event handler for removing the user from the group.
     *
     * @public
     * @param {Object} updatable Updatable group
     * @param {Object} member Group member (user)
     * @param {number} index Group member index
     * @returns {string} HTML markup
     */
    renderMember(updatable, member, index) {
        const { given_name, family_name, email } = member;
        const memberInfo = constructUserInfo(email, given_name, family_name);

        return (
            <Button
                key={`GroupMember${index}`}
                bsSize="small"
                onClick={this.removeMember.bind(this, updatable, member)}>
                {memberInfo} <Glyphicon glyph="remove" />
            </Button>
        );
    }

    /**
     * User list received event handler.
     *
     * Sets the user list store property and assigns the already existing group members to the member list.
     *
     * @private
     * @param userList
     * @private
     */
    _userListReceived(userList) {
        const { updatable } = this.props;
        const memberProfiles = userList.filter(user => updatable.members.indexOf(user._id) > -1);

        GroupActions.userListReceived(userList);
        GroupActions.membersReceived(memberProfiles);
    }

    /**
     * Renders group field controls.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { userList, updatable, members } = this.props;
        const { name } = updatable;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nosaukums</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Nosaukums"
                                maxLength={maxInputLength.regularField}
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Pievienot grupas biedru</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Pievienot biedru"
                                value=""
                                onChange={this.addMember.bind(this, updatable)}>
                                <option value=''></option>
                                {userList.map((user, index) => this.renderUser(user, index))}
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ControlLabel>Grupas biedri</ControlLabel>
                        <Well bsSize="small">
                            {members.map((member, index) => this.renderMember(updatable, member, index))}
                        </Well>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(GroupFields);
