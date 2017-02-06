import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Button, Row, Col, Well,
    FormGroup, FormControl,
    ControlLabel, Glyphicon
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
        const { updatable, isUpdating } = this.props.groups;

        // TODO: fix retreival by ID and remove this
        if (isUpdating && updatable.members.length > 0) {
            GroupActions.getMembers(updatable, token);
        }
    }

    handleChange(prop, event) {
        const { updatable } = this.props.groups;

        updatable[prop] = event.target.value;

        GroupActions.setUpdatable(updatable);
    }

    addMember(updatable, event) {
        const user = event.target.value;

        updatable.members.push(user._id);

        GroupActions.setUpdatable(user);
        GroupActions.memberAdded(user)
    }

    removeMember(member) {
        GroupActions.memberRemoved(member);
    }

    renderUser(user, index) {
        const { given_name, family_name, email } = user;
        const userInfo = `${email} (${given_name} ${family_name})`;

        return (
            <option
                key={`UserOption${index}`}
                value={user}>
                {userInfo}
            </option>
        );
    }

    renderMember(member, index) {
        const { given_name, family_name, email } = member;
        const memberInfo = `${email} (${given_name} ${family_name})`;

        return (
            <Button
                key={`GroupMember${index}`}
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
                                {userList.map((user, index) => this.renderUser(user, index))}
                            </FormControl>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Grupas biedri</ControlLabel>
                            <Well bsSize="small">
                                {members.map((member, index) => this.renderMember(member, index))}
                            </Well>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(GroupFields);
