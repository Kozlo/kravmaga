// dependencies
import React from 'react';
import { Button, Image, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';

// utility methods
import { getRoleValue, getStatusValue, formatDateString } from '../../../utils/utils';

class UserEntry extends React.Component {
    initUpdateGroup() { }

    deleteGroup() { }

    render() {
        const { group } = this.props;
        const { name } = group;
        const btnColStyle = { minWidth: '19em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name}</td>
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
