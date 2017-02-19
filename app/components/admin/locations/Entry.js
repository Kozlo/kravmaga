// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import LocationActions from '../../../actions/LocationActions';

class LocationEntry extends React.Component {
    initUpdateEntry(entry) {
        LocationActions.clearUpdatable(entry);
        LocationActions.setIsUpdating(true);
    }

    /**
     * Delete's the specified entry and requests.
     *
     * @param {Object} entry Entry
     */
    deleteEntry(entry) {
        const { _id, name } = entry;
        const confirmText = `Vai esi drošs, ka vēlies izdzēst lokāciju: ${name}?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        LocationActions.delete(_id, token);
    }

    render() {
        const { index, entry } = this.props;
        const { name } = entry;
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name}</td>
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

export default LocationEntry;
