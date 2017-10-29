import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, InputGroup,
    HelpBlock, ControlLabel, Glyphicon,
    Well, Button
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';
import GroupActions from '../../../actions/GroupActions';
import LocationActions from '../../../actions/LocationActions';
import UserActions from '../../../actions/UserActions';

import { maxInputLength } from '../../../utils/config';
import { initDateTimePicker, handleDateChange, constructUserInfo } from '../../../utils/utils';

/**
 * Lesson field update form control component.
 */
class LessonFields extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
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
     * Initiates the datetime picker and gets the latest group list (in case it's been updated).
     *
     * @public
     */
    componentDidMount() {
        const { token } = AuthStore.getState();
        const { updatable } = this.props;
        const { start, end } = updatable;
        const startChangeHandler = handleDateChange.bind(this, 'start', LessonActions, updatable, false);
        const endChangeHandler = handleDateChange.bind(this, 'end', LessonActions, updatable, false);

        initDateTimePicker('#start', startChangeHandler, start, true);
        initDateTimePicker('#end', endChangeHandler, end, true);

        GroupActions.getList(token, LessonActions.groupsReceived);
        LocationActions.getList(token, LessonActions.locationsReceived);
    }

    /**
     * Form control value changed handler.
     *
     * @public
     * @param {*} prop Property value
     * @param {Object} event Event object
     */
    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        LessonActions.setUpdatable(updatable);
    }

    /**
     * Mark that a user will be attending the lesson.
     *
     * @public
     * @param {Object} updatable Updatable lesson
     * @param {Object} event Event object
     */
    addAttendee(updatable, event) {
        const userId = event.target.value;

        if (updatable.attendees.indexOf(userId) >= 0) {
            return toastr.error('Lietotājs jau nodarbībai pievienots!');
        }

        updatable.attendees.push(userId);

        LessonActions.setUpdatable(updatable);
        LessonActions.attendeeAdded(userId);
    }

    /**
     * Render a group select option.
     *
     * @public
     * @param {Object} group Group entry
     * @param {number} index Group index
     * @returns {string} HTML markup
     */
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

    /**
     * Renders a button with the user's info and adds a click event handler for removing the user from the attendance list.
     *
     * @public
     * @param {Object} updatable Updatable group
     * @param {string} attendee Lesson attendee (user) ID
     * @param {number} index Lesson attendee index
     * @returns {string} HTML markup
     */
    renderAttendee(updatable, attendee, index) {
        const { userList } = this.props;
        const user = userList.find(user => user._id === attendee);
        let attendeeInfo = '';

        if (user) {
            const { given_name, family_name, email } = user;
            attendeeInfo = constructUserInfo(email, given_name, family_name);
        }

        return (
            <Button
                key={`LessonAttendee${index}`}
                bsSize="small"
                onClick={this.removeAttendee.bind(this, updatable, attendee)}>
                {attendeeInfo} <Glyphicon glyph="remove" />
            </Button>
        );
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
     * Removes an attendee from a lesson.
     *
     * @public
     * @param {Object} updatable Updatable object
     * @param {string} attendee Lesson attendee ID
     */
    removeAttendee(updatable, attendee) {
        const attendeeIndex = updatable.attendees.indexOf(attendee);

        updatable.attendees.splice(attendeeIndex, 1);

        LessonActions.setUpdatable(updatable);
        LessonActions.attendeeRemoved(attendee);
    }

    /**
     * User list received event handler.
     *
     * Sets the user list store property.
     *
     * @private
     * @param userList
     * @private
     */
    _userListReceived(userList) {
        LessonActions.userListReceived(userList);
    }

    /**
     * Updates the updatable propery value.
     *
     * @private
     * @param {string} prop Property name
     * @param {Date} value Property value
     */
    _updateData(prop, value) {
        const { updatable } = this.props;

        updatable[prop] = value;

        LessonActions.setUpdatable(updatable);
    }

    /**
     * Renders lesson field form controls.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { updatable, groups, locations, userList } = this.props;
        const { group, location, comment, attendees } = updatable;

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
                </Row>
                <Row>
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
                </Row>
                <Row>
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
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Lokācija (no definētām)</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Lokācija"
                                onChange={this.handleChange.bind(this, 'location')}
                                value={location}>
                                <option value=''></option>
                                {locations.map((location, index) => <option key={`LocationOption${index}`}>{location.name}</option>)}
                            </FormControl>
                            <FormControl.Feedback />
                            <HelpBlock>Vieta, kur nodarbība notiks.</HelpBlock>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Lokācija (brīvs teksts)</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Location"
                                value={location}
                                maxLength={maxInputLength.regularField}
                                onChange={this.handleChange.bind(this, 'location')}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
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
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Pievienot nodarbības dalībnieku</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Pievienot dalībnieku"
                                value=""
                                onChange={this.addAttendee.bind(this, updatable)}>
                                <option value=''></option>
                                {userList.map((user, index) => this.renderUser(user, index))}
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ControlLabel>Nodarbības dalībnieki</ControlLabel>
                        <Well bsSize="small">
                            {attendees.map((attendee, index) => this.renderAttendee(updatable, attendee, index))}
                        </Well>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(LessonFields);
