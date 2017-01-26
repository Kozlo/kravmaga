import React from 'react';
import { Button } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';
import { getRoleValue, getStatusValue } from '../../../utils/utils';

class UserEntry extends React.Component {
    updateUser(user) {
        const updatableUser = Object.assign({}, user);

        UserActions.setUpdatableUser(updatableUser);
    }

    deleteUser(user) {
        const { token } = AuthStore.getState();
        const { _id, given_name, family_name, email, admin_fields } = user;
        const role = getRoleValue(admin_fields.role);
        const confirmText = `Vai esi drošs, ka vēlies izdzēst lietotāju ${given_name} ${family_name} ar e-pastu ${email} un lomu ${role}?`;

        if (confirm(confirmText)) {
            UserActions.deleteUser(_id, token);
        }
    }

    render() {
        const { user, index } = this.props;
        const { given_name, family_name, email, phone, picture, admin_fields } = user;
        const { role, is_blocked } = admin_fields;
        const roleValue = getRoleValue(role);
        const status = getStatusValue(is_blocked);
        const imageStyle = {
            maxWidth: '40px',
            maxHeight: '40xp'
        };

        return (
            <tr>
                <td>{index + 1}</td>
                <td><img src={picture} alt="User Image" style={imageStyle} /></td>
                <td>{given_name}</td>
                <td>{family_name}</td>
                <td>{email}</td>
                <td>{phone}</td>
                <td>{status}</td>
                <td>{roleValue}</td>
                <td>
                    <Button className="btn btn-info"
                            data-toggle="modal"
                            data-target="#userModal"
                            onClick={this.updateUser.bind(this, user)}>Labot</Button>
                </td>
                <td>
                    {/*TODO: probably remove from production to avoid unexpected problems*/}
                    <Button className="btn btn-danger"
                            onClick={this.deleteUser.bind(this, user)}>Izdzēst</Button>
                </td>
            </tr>
        );
    }
}

export default UserEntry;
