// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';

// utils
import { formatDateString } from '../../../utils/utils';

class LessonEntry extends React.Component {
    markAttending(lessonId) {
        this._updateAttendance(lessonId, LessonActions.markAttending);
    }

    removeAttending(lessonId) {
        this._updateAttendance(lessonId, LessonActions.removeAttending);
    }

    findGroupName(groupId) {
        const { groups } = LessonStore.getState();
        const foundGroup = groups.filter(group => group._id === groupId)[0];

        return foundGroup ? foundGroup.name : 'Nezināma grupa';
    }

    determineIsAttending(entry) {
        const { userId } = AuthStore.getState();

        return entry.attendees.indexOf(userId) > -1;
    }

    _updateAttendance(lessonId, action) {
        const { token, userId } = AuthStore.getState();

        action(token, lessonId, userId);
    }

    render() {
        const { index, entry } = this.props;
        const { start, end, group, location, comment } = entry;
        const formattedStartDate = formatDateString(start, true);
        const formattedEndDate = formatDateString(end, true);
        const groupName = this.findGroupName(group);
        const isAttending = this.determineIsAttending(entry);

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{formattedStartDate}</td>
                <td>{formattedEndDate}</td>
                <td>
                    <div className="cell-wrapper comment-cell">
                        {groupName}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper comment-cell">
                        {location}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper comment-cell">
                        {comment}
                    </div>
                </td>
                <td>
                    {
                        !isAttending &&
                        <Button
                            bsStyle="success"
                            onClick={this.markAttending.bind(this, entry._id)}>
                            Ieradīšos
                        </Button>
                    }
                    {
                        isAttending &&
                        <Button
                            bsStyle="danger"
                            onClick={this.removeAttending.bind(this, entry._id)}>
                            Netieku
                        </Button>
                    }
                </td>
            </tr>
        );
    }
}

export default LessonEntry;
