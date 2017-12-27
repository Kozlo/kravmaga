import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    ControlLabel, Glyphicon,
    Well, Button
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';
import UserActions from '../../../actions/UserActions';

import {
    constructUserInfo, constructUserOptions
} from '../../../utils/utils';

/**
 * Lesson attendee update form control component.
 */
class LessonAttendees extends React.Component {
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
     * Mark that a user will be attending the lesson.
     *
     * Clears the typeahead when the user had been selected.
     * Uses setTimeout of 1 ms to put in on the next thing on the event loop.
     *
     * @public
     * @param {Object} updatable Updatable lesson
     * @param {Object} selected selected option
     */
    addAttendee(updatable, selected) {
        if (!selected || !selected[0] ||!selected[0].id) {
            return
        } else {
            setTimeout(() => this.typeahead.getInstance().clear(), 1);
        }

        const userId = selected[0].id;

        if (updatable.attendees.indexOf(userId) >= 0) {
            return toastr.error('Lietotājs jau nodarbībai pievienots!');
        }

        updatable.attendees.push(userId);

        LessonActions.setUpdatable(updatable);
        LessonActions.attendeeAdded(userId);
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
     * Renders lesson field form controls.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { updatable, userList } = this.props;
        const { attendees } = updatable;
        const userOptions = constructUserOptions(userList);

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Pievienot nodarbības dalībnieku</ControlLabel>
                            <Typeahead
                                multiple={false}
                                options={userOptions}
                                onChange={this.addAttendee.bind(this, updatable)}
                                placeholder="Pievienot dalībnieku"
                                ref={ ref => this.typeahead = ref }
                            />
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

export default connectToStores(LessonAttendees);
