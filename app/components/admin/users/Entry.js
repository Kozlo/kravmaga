// dependencies
import React from 'react';
import { Button, Image, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';

import PaymentActions from '../../../actions/PaymentActions';

// utility methods
import {
    getRoleValue, getStatusValue,
    formatDateString, getGenderValue
} from '../../../utils/utils';

/**
 * User entry data presentation component.
 */
class UserEntry extends React.Component {
    /**
     * Clears the updatable user and sets the is updating flag to true to show the user update modal.
     *
     * @public
     * @param {string} entry User entry
     */
    initUpdateEntry(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsUpdating(true);
    }

    /**
     * Clears the updateable user and sets the is changing password flag to true to show the change password modal.
     *
     * @public
     * @param {string} entry User entry
     */
    initChangePassword(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsChangingPassword(true);
    }

    /**
     * Asks for confirmation before deleting a user entry.
     *
     * @public
     * @param {string} entry User entry
     */
    deleteEntry(entry) {
        const { _id, given_name, family_name, email, admin_fields } = entry;
        const role = getRoleValue(admin_fields.role);
        const confirmText = `Vai esi drošs, ka vēlies izdzēst lietotāju ${given_name} ${family_name} ar e-pastu ${email} un lomu ${role}?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        UserActions
            .delete(_id, token)
            .then(() => this._onEntryDeleted(token));
    }

    /**
     * Updates group and lesson stores.
     *
     * @param {string} token Authentication token
     * @private
     */
    _onEntryDeleted(token) {
        UserActions.getList(token, PaymentActions.onUsersReceived);
    }

    /**
     * Renders user data row.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { user, index } = this.props;
        const {
            given_name, family_name,
            email, phone, birthdate,
            picture, gender,
            admin_fields
        } = user;
        const {
            role, is_blocked, member_since, attendance_count
        } = admin_fields;
        const birthdateValue = formatDateString(birthdate);
        const genderValue = getGenderValue(gender);
        const roleValue = getRoleValue(role);
        const status = getStatusValue(is_blocked);
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
                <td>
                    <div className="cell-wrapper full-name-cell">
                        {given_name} {family_name}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper email-cell">
                        <Link to={`/user/${user._id}`}>{email}</Link>
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper phone-cell">
                        {phone}
                    </div>
                </td>
                <td className="date-cell">{birthdateValue}</td>
                <td>{genderValue}</td>
                <td className="date-cell">{memberSinceValue}</td>
                <td>{status}</td>
                <td>{roleValue}</td>
                <td>{attendance_count}</td>
                <td style={btnColStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.initUpdateEntry.bind(this, user)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="warning"
                            onClick={this.initChangePassword.bind(this, user)}>
                            Mainīt Paroli
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.deleteEntry.bind(this, user)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default UserEntry;
