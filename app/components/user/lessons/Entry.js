// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import GroupStore from '../../../stores/GroupStore';
import LessonActions from '../../../actions/LessonActions';

// utils
import { formatDateString } from '../../../utils/utils';

/**
 * Lesson entry data presentation component.
 */
class LessonEntry extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return { groups: GroupStore.getState() };
    }

    /**
     * Calls the method to mark (int the store, not BE) that the user will be attending a lesson.
     *
     * @public
     * @param {string} lessonId Lesson ID
     */
    markAttending(lessonId) {
        this._updateAttendance(lessonId, LessonActions.markAttending);
    }

    /**
     * Calls the method to mark (int the store, not BE) that the user won't be attending a lesson.
     *
     * @public
     * @param {string} lessonId Lesson ID
     */
    removeAttending(lessonId) {
        this._updateAttendance(lessonId, LessonActions.removeAttending);
    }

    /**
     * Finds the name of the group by it's ID.
     *
     * Returns 'unknown group' if the group wasn't found.
     * This normally indicates that something is wrong.
     *
     * @public
     * @param {string} groupId Group ID
     * @returns {string} Found group name
     */
    findGroupName(groupId) {
        const { list } = this.props.groups;
        const foundGroup = list.filter(group => group._id === groupId)[0];

        return foundGroup ? foundGroup.name : 'Nezināma grupa';
    }

    /**
     * Determine's if a user is in the list of attendees.
     *
     * @public
     * @param {string} entry User ID
     * @returns {boolean} Flag showing if the user is attending
     */
    determineIsAttending(entry) {
        const { userId } = AuthStore.getState();

        return entry.attendees.indexOf(userId) > -1;
    }

    /**
     * Calls the passed attendance method (add/remove).
     *
     * @private
     * @param {string} lessonId Lesson ID
     * @param {Function} action Actions to call
     */
    _updateAttendance(lessonId, action) {
        const { token, userId } = AuthStore.getState();

        action(token, lessonId, userId);
    }

    /**
     * Renders the user profile panel data.
     *
     * If the component is not read-only, renders user profile actions.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { index, entry } = this.props;
        const { start, end, group, location, comment } = entry;
        const formattedStartDate = formatDateString(start, true);
        const formattedEndDate = formatDateString(end, true);
        const groupName = this.findGroupName(group);
        const isAttending = this.determineIsAttending(entry);
        const btnToolbarStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td className="date-time-cell">{formattedStartDate}</td>
                <td className="date-time-cell">{formattedEndDate}</td>
                <td>
                    <div className="cell-wrapper group-cell">
                        {groupName}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper location-cell">
                        {location}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper comment-cell">
                        {comment}
                    </div>
                </td>
                <td style={btnToolbarStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="success"
                            onClick={this.markAttending.bind(this, entry._id)}
                            disabled={isAttending}>
                            Tieku
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.removeAttending.bind(this, entry._id)}
                            disabled={!isAttending}>
                            Netieku
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default connectToStores(LessonEntry);
