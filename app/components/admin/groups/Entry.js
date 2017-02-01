// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import GroupActions from '../../../actions/GroupActions';

// utility methods

class UserEntry extends React.Component {
    initUpdateGroup(group) {
        GroupActions.clearUpdatableGroup(group);
        GroupActions.setIsUpdating(true);
    }

    deleteGroup(group, memberCount) {
        const { _id, name } = group;
        const confirmText = `Vai esi drošs, ka vēlies izdzēst grupu ${name} ar ${memberCount} lietotājiem?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        GroupActions.deleteGroup(_id, token);
    }

    render() {
        const { index, group, memberCount } = this.props;
        const { name } = group;
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>{memberCount}</td>
                <td style={btnColStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.initUpdateGroup.bind(this, group)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.deleteGroup.bind(this, group)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default UserEntry;
