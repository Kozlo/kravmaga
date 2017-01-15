import React from 'react';
import { Button } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';

class UserEntry extends React.Component {

    static getStores() {
        return [AuthStore];
    }

    static getPropsFromStores() {
        return AuthStore.getState();
    }

    updateUser(user) {
        const updatableUser = Object.assign({}, user);

        UserActions.setUpdatableUser(updatableUser);
    }

    deleteUser(user) {
        const { token } = this.props;
        const role = user.is_admin ? 'admin' : 'lietotājs';
        const confirmText = `Vai esi drošs, ka vēlies izdzēst lietotāju ${user.given_name} ${user.family_name} ar e-pastu ${user.email} un lomu ${role}?`;

        if (confirm(confirmText)) {
            UserActions.deleteUser(user._id, token);
        }
    }

    _getAuthorizationType(auth_id) {
        if (auth_id.includes('google')) return 'Google';
        if (auth_id.includes('facebook')) return 'Facebook';
        if (auth_id.includes('auth0')) return 'E-pasts';

        return 'Nenoteikts';
    }

    render() {
        const { user, index } = this.props;
        const { given_name, family_name, email, gender, picture, auth_id } = user;
        const imageStyle = { maxWidth: '40px', maxHeight: '40xp' };
        const genderValue = gender == 'male' ? 'Vīrietis' : (gender == 'female' ? 'Sieviete' : '');
        const role = user.is_admin ? 'admin' : 'lietotājs';
        const status = user.is_blocked ? 'bloķēts' : 'aktīvs';
        const authType = this._getAuthorizationType(auth_id);

        return (
            <tr>
                <td>{index + 1}</td>
                <td><img src={picture} alt="User Image" style={imageStyle} /></td>
                <td>{given_name}</td>
                <td>{family_name}</td>
                <td>{email}</td>
                <td>{genderValue}</td>
                <td>{authType}</td>
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

export default connectToStores(UserEntry);
