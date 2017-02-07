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
        const { users, groups } = this.props;
        const { updatable } = groups;
        const memberProfiles = users.list.filter(user => updatable.members.indexOf(user._id) > -1);

        GroupActions.membersReceived(memberProfiles);
    }

    handleChange(prop, event) {
        const { updatable } = this.props.groups;

        updatable[prop] = event.target.value;

        GroupActions.setUpdatable(updatable);
    }

    addMember(updatable, event) {
        const userId = event.target.value;

        if (updatable.members.indexOf(userId) > -1) {
            return toastr.error('Lietotājs jau grupai ir pievienots');
        }

        const user = this.props.users.list.filter(user => user._id === userId)[0];

        updatable.members.push(userId);

        GroupActions.setUpdatable(updatable);
        GroupActions.memberAdded(user)
    }

    removeMember(updatable, member) {
        const memberIndex = updatable.members.indexOf(member._id);

        updatable.members.splice(memberIndex, 1);

        GroupActions.setUpdatable(updatable);
        GroupActions.memberRemoved(member);
    }

    renderUser(user, index) {
        const { _id, given_name, family_name, email } = user;
        const userInfo = `${email} (${given_name} ${family_name})`;

        return (
            <option
                key={`UserOption${index}`}
                value={_id}>
                {userInfo}
            </option>
        );
    }

    renderMember(updatable, member, index) {
        const { given_name, family_name, email } = member;
        const memberInfo = `${email} (${given_name} ${family_name})`;

        return (
            <Button
                key={`GroupMember${index}`}
                bsSize="small"
                onClick={this.removeMember.bind(this, updatable, member)}>
                {memberInfo} <Glyphicon glyph="remove" />
            </Button>
        );
    }

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
