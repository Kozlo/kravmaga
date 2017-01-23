import React from 'react';
import { Button } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';

class UserEntry extends React.Component {
    updateUser(user) {
        const updatableUser = Object.assign({}, user);

        UserActions.setUpdatableUser(updatableUser);
    }

    deleteUser(user) {
        const { token } = AuthStore.getState();
        const role = user.is_admin ? 'admin' : 'lietotājs';
        const confirmText = `Vai esi drošs, ka vēlies izdzēst lietotāju ${user.given_name} ${user.family_name} ar e-pastu ${user.email} un lomu ${role}?`;

        if (confirm(confirmText)) {
            UserActions.deleteUser(user._id, token);
        }
    }

    render() {
        const { user, index } = this.props;
        const imageStyle = { maxWidth: '40px', maxHeight: '40xp' };
        const { given_name, family_name, email, picture } = user;
        const admin_fields = user.admin_fields || {};
        const { is_admin, is_blocked } = admin_fields;
        const role = is_admin ? 'admin' : 'lietotājs';
        const status = is_blocked ? 'bloķēts' : 'aktīvs';

        return (
            <tr>
                <td>{index + 1}</td>
                <td><img src={picture} alt="User Image" style={imageStyle} /></td>
                <td>{given_name}</td>
                <td>{family_name}</td>
                <td>{email}</td>
                <td>{status}</td>
                <td>{role}</td>
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
