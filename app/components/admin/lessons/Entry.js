// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonActions from '../../../actions/LessonActions';

class LessonEntry extends React.Component {
    initUpdateEntry(entry) {
        LessonActions.clearUpdatable(entry);
        LessonActions.setIsUpdating(true);
    }

    delete(entry, attendeeCount) {
        const { _id, date } = entry;
        // TODO: parse the date to something more readable
        const confirmText = `Vai esi drošs, ka vēlies izdzēst nodarbību ${date} datumā ar ${attendeeCount} pieteikušiem lietotājiem?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        LessonActions.delete(_id, token);
    }

    render() {
        const { index, entry } = this.props;
        const { date, group, location, attendees, comment } = entry;
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{date}</td>
                <td>{group}</td>
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
