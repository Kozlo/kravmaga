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
    markAttending(lesson) {
        // TODO: add user ID to the group
    }

    removeAttending(lesson) {
        // TODO: remove attendee from lesson
    }

    findGroupName(groupId) {
        const { groups } = LessonStore.getState();
        const foundGroup = groups.filter(group => group._id === groupId)[0];

        return foundGroup ? foundGroup.name : 'Nezināma grupa';
    }

    render() {
        const { index, entry } = this.props;
        const { date, group, location, comment } = entry;
        const formattedDate = formatDateString(date, true);
        const groupName = this.findGroupName(group);

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{formattedDate}</td>
                <td>{groupName}</td>
                <td>{location}</td>
                <td>{comment}</td>
                <td>
                    {/*TODO: add pieteikties/atteikties buttson*/}
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.markAttending.bind(this, entry)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.removeAttending.bind(this, entry)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default LessonEntry;
