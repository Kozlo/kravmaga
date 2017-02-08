// dependencies
import React from 'react';
import { Button, Image, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';

// utility methods
import { getRoleValue, getStatusValue, formatDateString } from '../../../utils/utils';

class UserEntry extends React.Component {
    initUpdate(user) {
        UserActions.clearUpdatable(user);
        UserActions.setIsUpdating(true);
    }

    initChangePassword(user) {
        UserActions.clearUpdatable(user);
        UserActions.setIsChangingPassword(true);
    }

    delete(user) {
        const { _id, given_name, family_name, email, admin_fields } = user;
        const role = getRoleValue(admin_fields.role);
        const confirmText = `Vai esi drošs, ka vēlies izdzēst lietotāju ${given_name} ${family_name} ar e-pastu ${email} un lomu ${role}?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        UserActions.delete(_id, token);
    }

    render() {
        const { user, index } = this.props;
        const {
            given_name, family_name,
            email, phone,
            birthdate, member_since,
            picture, admin_fields
        } = user;
        const roleValue = getRoleValue(admin_fields.role);
        const status = getStatusValue(admin_fields.is_blocked);
        const birthdateValue = formatDateString(birthdate);
        const memberSinceValue = formatDateString(member_since);
        const btnColStyle = { minWidth: '19em' };
        const imageStyle = {
            maxWidth: '2.5em',
            maxHeight: '2.5em'
        };

        return (
            <tr>
                <td>{index + 1}</td>
                <td><Image src={picture} style={imageStyle} responsive /></td>
                <td>{given_name}</td>
                <td>{family_name}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>{birthdateValue}</td>
                <td>{memberSinceValue}</td>
                <td>{status}</td>
                <td>{roleValue}</td>
                <td style={btnColStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.initUpdate.bind(this, user)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="warning"
                            onClick={this.initChangePassword.bind(this, user)}>
                            Mainīt Paroli
                        </Button>
                        {/*TODO: probably remove from production to avoid unexpected problems*/}
                        <Button
                            bsStyle="danger"
                            onClick={this.delete.bind(this, user)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default UserEntry;
