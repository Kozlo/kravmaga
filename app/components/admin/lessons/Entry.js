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
    initUpdateEntry(entry) {
        LessonActions.clearUpdatable(entry);
        LessonActions.setIsUpdating(true);
    }

    delete(entry) {
        const { _id, date, attendees } = entry;
        const formattedDate = formatDateString(date, true);
        const confirmText = `Vai esi drošs, ka vēlies izdzēst nodarbību ${formattedDate} datumā ar ${attendees.length} pieteikušiem lietotājiem?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        LessonActions.delete(_id, token);
    }

    findGroupName(groupId) {
        const { groups } = LessonStore.getState();
        const foundGroup = groups.filter(group => group._id === groupId)[0];

        return foundGroup ? foundGroup.name : 'Nezināma grupa';
    }

    render() {
        const { index, entry } = this.props;
        const { date, group, location, attendees, comment } = entry;
        const formattedDate = formatDateString(date, true);
        const groupName = this.findGroupName(group);
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{formattedDate}</td>
                <td>{groupName}</td>
                <td>{location}</td>
                <td>{attendees.length}</td>
                <td>{comment}</td>
                <td style={btnColStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.initUpdateEntry.bind(this, entry)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.delete.bind(this, entry)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default LessonEntry;
