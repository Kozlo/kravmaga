// dependencies
import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Popover, OverlayTrigger } from 'react-bootstrap';

// stores and actions
import LessonStore from '../../../stores/LessonStore';

// utils
import { constructUserInfo } from '../../../utils/utils';

/**
 * Lesson entry data presentation component.
 */
class AttendeeList extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    /**
     * Renders a button with the user's info and adds a click event handler for removing the user from the attendance list.
     *
     * @public
     * @param {string} attendeeId Lesson attendee (user) ID
     * @param {number} index Iteration item index
     * @returns {string} HTML markup
     */
    renderAttendeeInfo(attendeeId, index) {
        const { userList } = this.props;
        const user = userList.find(user => user._id === attendeeId);
        let attendeeInfo = '';

        if (user) {
            const { given_name, family_name, email } = user;
            attendeeInfo = constructUserInfo(email, given_name, family_name);
        }

        return (
            <p key={`LessonAttendeeListItem${index}`}>{attendeeInfo}</p>
        );
    }

    /**
     * Renders a lesson's data in table cells.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { attendeeIds = [] } = this.props;
        const attendeesPopover = (
            <Popover id="modal-popover" title="Nodarbības dalībnieki">
                {attendeeIds.map((attendeeId, index) => this.renderAttendeeInfo(attendeeId, index))}
            </Popover>
        );

        return (
            <OverlayTrigger overlay={attendeesPopover}><a href="#">{attendeeIds.length}</a></OverlayTrigger>
        );
    }
}

export default connectToStores(AttendeeList);
