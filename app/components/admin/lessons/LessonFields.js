import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, InputGroup,
    HelpBlock, ControlLabel, Glyphicon
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';
import GroupActions from '../../../actions/GroupActions';

import { maxInputLength } from '../../../utils/config';
import { initDateTimePicker, handleDateChange } from '../../../utils/utils';

class LessonFields extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    /**
     * Initiates the datetime picker and gets the latest group list (in case it's been updated).
     */
    componentDidMount() {
        const { token } = AuthStore.getState();
        const { updatable } = this.props;
        const { start, end } = updatable;
        const startChangeHandler = handleDateChange.bind(this, 'start', LessonActions, updatable);
        const endChangeHandler = handleDateChange.bind(this, 'end', LessonActions, updatable);

        initDateTimePicker('#start', startChangeHandler, start, true);
        initDateTimePicker('#end', endChangeHandler, end, true);

        GroupActions.getList(token, LessonActions.groupsReceived);
    }

    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        LessonActions.setUpdatable(updatable);
    }

    addAttendee(updatable, event) {
        const user = event.target.value;

        updatable.attendees.push(user._id);

        LessonActions.setUpdatable(updatable);
        LessonActions.attendeeAdded(user)
    }

    // removeAttendee(member) {
    //     LessonActions.attendeeRemoved(member);
    // }

    /*renderUser(user, index) {
        const { given_name, family_name, email } = user;
        const userInfo = `${email} (${given_name} ${family_name})`;

        return (
            <option
                key={`AttendeeOption${index}`}
                value={user}>
                {userInfo}
            </option>
        );
    }*/

    renderGroup(group, index) {
        const { name, members } = group;
        const groupInfo = `${name} (${members.length} dalībnieki)`;

        return (
            <option
                key={`GroupOption${index}`}
                value={group._id}>
                {groupInfo}
            </option>
        );
    }

    /*renderAttendee(attendee, index) {
        const { given_name, family_name, email } = attendee;
        const memberInfo = `${email} (${given_name} ${family_name})`;

        return (
            <Button
                key={`LessonAttendee${index}`}
                bsSize="small"
                onClick={this.removeAttendee.bind(this, attendee)}>
                {memberInfo} <Glyphicon glyph="remove" />
            </Button>
        );
    }*/

    _handleDateChange(prop, date) {
        date = date && date !== 'false' ? date : '';

        this._updateData(prop, date);
    }

    _updateData(prop, value) {
        const { updatable } = this.props;

        updatable[prop] = value;

        LessonActions.setUpdatable(updatable);
    }

    render() {
        const { updatable, groups } = this.props;
        const { /*_id,*/ group, location,/* attendees,*/ comment } = updatable;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Sākums</ControlLabel>
                            <InputGroup id='start'>
                                <FormControl
                                    type="text"
                                    placeholder="Nodarbības sākuma datums un laiks"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Nodarbības sākuma datums un laiks.</HelpBlock>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Beigas</ControlLabel>
                            <InputGroup id='end'>
                                <FormControl
                                    type="text"
                                    placeholder="Nodarbības beigu datums un laiks"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Nodarbības beigu datums un laiks.</HelpBlock>
                        </FormGroup>
                    </Col>
                    {/*TODO: reques the group name in a separate request*/}
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Grupa</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Grupa"
                                onChange={this.handleChange.bind(this, 'group')}
                                value={group}>
                                <option value=''></option>
                                {groups.map((group, index) => this.renderGroup(group, index))}
                            </FormControl>
                            <FormControl.Feedback />
                            <HelpBlock>Grupa priekš kuras nodarbība notiks.</HelpBlock>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Lokācija</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Lokācija"
                                maxLength={maxInputLength.regularField}
                                value={location}
                                onChange={this.handleChange.bind(this, 'location')}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Vieta, kur nodarbība notiks.</HelpBlock>
                        </FormGroup>
                    </Col>
                    {/*TODO: add this later*/}
                    {/*<Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nodarbības dalībnieki</ControlLabel>
                            <Well bsSize="small">
                                {attendees.map((attendee, index) => this.renderAttendee(attendee, index))}
                            </Well>
                        </FormGroup>
                    </Col>*/}
                    {/*TODO: add this later*/}
                    {/*<Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Pievienot nodarbības dalībnieku</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Pievienot dalībnieku"
                                onChange={this.addAttendee.bind(this, updatable)}>
                                <option value=''></option>
                                {userList.map((user, index) => this.renderUser(user, index))}
                            </FormControl>
                        </FormGroup>
                    </Col>*/}
                    <Col xs={12}>
                        <FormGroup controlId="comment">
                            <ControlLabel>Komentāri (ne-obligāti)</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                placeholder="Komentārs"
                                maxLength={maxInputLength.textArea}
                                value={comment}
                                onChange={this.handleChange.bind(this, 'comment')}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Komentāri.</HelpBlock>
                        </FormGroup>
                    </Col>      
                </Row>
            </div>
        );
    }
}

export default connectToStores(LessonFields);
