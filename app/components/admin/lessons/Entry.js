// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';

// utils
import { formatDateString } from '../../../utils/utils';

/**
 * Lesson entry data presentation component.
 */
class LessonEntry extends React.Component {
    /**
     * Initiates entry update modal.
     *
     * @public
     * @param {Object} entry Lesson entry
     */
    initUpdateEntry(entry) {
        LessonActions.clearUpdatable(entry);
        LessonActions.setIsUpdating(true);
    }

    /**
     * Delete lesson entry handler.
     *
     * Confirms if the user really wants to delete the entry before doing so.
     *
     * @public
     * @param {Object} entry Entry object
     */
    deleteEntry(entry) {
        const { _id, start, end, attendees } = entry;
        const formattedStartDate = formatDateString(start, true);
        const formattedEndDate = formatDateString(end, true);
        const confirmText = `Vai esi drošs, ka vēlies izdzēst nodarbību ${formattedStartDate} - ${formattedEndDate} datumos ar ${attendees.length} pieteikušiem lietotājiem?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        LessonActions.delete(_id, token);
    }

    /**
     * Determine a group's name based on the ID and the full group list.
     *
     * @public
     * @param {string} groupId Group ID
     * @returns {string} Group name
     */
    findGroupName(groupId) {
        const { groups } = LessonStore.getState();
        const foundGroup = groups.filter(group => group._id === groupId)[0];

        return foundGroup ? foundGroup.name : 'Nezināma grupa';
    }

    /**
     * Renders a lesson's data in table cells.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { index, entry } = this.props;
        const { start, end, group, location, attendees, comment } = entry;
        const formattedStartDate = formatDateString(start, true);
        const formattedEndDate = formatDateString(end, true);
        const groupName = this.findGroupName(group);
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{formattedStartDate}</td>
                <td>{formattedEndDate}</td>
                <td>
                    <div className="cell-wrapper">
                        {groupName}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper location-cell">
                        {location}
                    </div>
                </td>
                <td>{attendees.length}</td>
                <td>
                    <div className="cell-wrapper comment-cell">
                        {comment}
                    </div>
                </td>
                <td style={btnColStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.initUpdateEntry.bind(this, entry)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.deleteEntry.bind(this, entry)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default LessonEntry;
