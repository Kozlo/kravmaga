import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Button, Row, Col, Well,
    FormGroup, FormControl,
    ControlLabel, Glyphicon
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';

import { maxInputLength } from '../../../utils/config';

/**
 * Group field update form control component.
 */
class GroupFields extends React.Component {
    static getStores() {
        return [UserStore, GroupStore];
    }

    static getPropsFromStores() {
        return {
            groups: GroupStore.getState(),
            users: UserStore.getState()
        };
    }

    /**
     * Retrieved group members (i.e. user data)
     *
     * @public
     */
    componentWillMount() {
        const { users, groups } = this.props;
        const { updatable } = groups;
        const memberProfiles = users.list.filter(user => updatable.members.indexOf(user._id) > -1);

        GroupActions.membersReceived(memberProfiles);
    }

    /**
     * Property value changed handler.
     *
     * @public
     * @param {string} prop Property name
     * @param {Object} event Event object
     */
    handleChange(prop, event) {
        const { updatable } = this.props.groups;

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

        const user = this.props.users.list.filter(user => user._id === userId)[0];

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
        const userInfo = this._constructUserInfo(email, given_name, family_name);

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
        const memberInfo = this._constructUserInfo(email, given_name, family_name);

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
     * Constructs a string consisting of a user's email, name, and last name.
     *
     * @private
     * @param {string} email User's email
     * @param {string} given_name User's first name
     * @param {string} family_name User's last name
     * @returns {string} Constructed user info
     */
    _constructUserInfo(email, given_name, family_name) {
        return `${email} (${given_name || ''} ${family_name || ''})`;
    }

    /**
     * Renders group field controls.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { users, groups } = this.props;
        const userList = users.list;
        const { updatable, members } = groups;
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
