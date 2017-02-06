import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Button, Row, Col, FormGroup,
    FormControl, ControlLabel
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';

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

    componentWillMount() {
        const { token } = AuthStore.getState();
        const { updatable } = this.props;

        GroupActions.getMembers(updatable, token);
    }

    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        GroupActions.setUpdatable(updatable);
    }

    addMember(updatable, event) {
        const member = event.target.value;

        updatable.members.push(member);

        GroupActions.setUpdatable();
        GroupActions.memberAdded(member)
    }

    removeMember(member) {
        GroupActions.memberRemoved(member);
    }

    renderUser(user) {
        const { given_name, family_name, email } = user;
        const userInfo = `${email} (${given_name} ${family_name})`;

        return (
            <option value={user}>{userInfo}</option>
        );
    }

    renderMember(member) {
        const { given_name, family_name, email } = member;
        const memberInfo = `${email} (${given_name} ${family_name})`;

        return (
            <Button
                bsSize="small"
                onClick={this.removeMember.bind(this, member)}>
                {memberInfo} <Glyphicon glyph="remove" />
            </Button>
        );
    }

    render() {
        const { users, groups } = this.props;
        const userList = users.list;
        const { updatable, members } = groups;
        const { _id, name } = updatable;
        const groupMembers = members[_id] || [];

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nosaukums</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Nosaukums"
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
                                onChange={this.addMember.bind(this, updatable)}>
                                <option value=''></option>
                                {userList.map(user => this.renderUser(user))}
                            </FormControl>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Grupas biedri</ControlLabel>
                            {groupMembers.map(member => this.renderMember(member))}
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(GroupFields);
