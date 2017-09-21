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

import { maxInputLength } from '../../../utils/config';
import { initDateTimePicker, handleDateChange } from '../../../utils/utils';

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
        const user = event.target.value;

        updatable.attendees.push(user._id);

        LessonActions.setUpdatable(updatable);
        LessonActions.attendeeAdded(user)
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
        // TODO: replac the user ID with full user info (need to request the data when the component mounts)
        // const { given_name, family_name, email } = member;
        // const memberInfo = constructUserInfo(email, given_name, family_name);

        return (
            <Button
                key={`LessonAttendee${index}`}
                bsSize="small"
                onClick={this._removeAttendee.bind(this, updatable, attendee)}>
                {attendee} <Glyphicon glyph="remove" />
            </Button>
        );
    }

    /**
     * Removes an attendee from a lesson.
     *
     * @public
     * @param {Object} updatable Updatable object
     * @param {string} attendee Lesson attendee ID
     */
    _removeAttendee(updatable, attendee) {
        const attendeeIndex = updatable.attendees.indexOf(attendee);

        updatable.attendees.splice(attendeeIndex, 1);

        LessonActions.setUpdatable(updatable);
        LessonActions.attendeeRemoved(attendee);
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
        const { updatable, groups, locations } = this.props;
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
