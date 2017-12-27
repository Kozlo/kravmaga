// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import GroupActions from '../../../actions/GroupActions';

/**
 * Lesson entry data presentation component.
 */
class GroupEntry extends React.Component {
    /**
     * Initiates an entry update.
     *
     * @public
     * @param {Object} entry User entry
     */
    initUpdateEntry(entry) {
        GroupActions.clearUpdatable(entry);
        GroupActions.setIsUpdating(true);
    }

    /**
     * Delete's the specified entry and requests.
     *
     * Also updates lesson data as some of it might have changes as a result.
     *
     * @param {Object} entry Entry
     * @param {number} memberCount Number of groups members
     */
    deleteEntry(entry, memberCount) {
        const { _id, name } = entry;
        const confirmText = `Vai esi drošs, ka vēlies izdzēst grupu ${name} ar ${memberCount} lietotājiem?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        GroupActions.delete(_id, token);
    }

    /**
     * Renders group entries in a table format.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { index, entry } = this.props;
        const { name, members } = entry;
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>{members.length}</td>
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

export default GroupEntry;
