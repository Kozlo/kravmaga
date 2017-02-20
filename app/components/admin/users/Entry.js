// dependencies
import React from 'react';
import { Button, Image, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserActions from '../../../actions/UserActions';

import GroupStore from '../../../stores/GroupStore';
import GroupActions from '../../../actions/GroupActions';

import LessonStore from '../../../stores/LessonStore';
import LessonActions from '../../../actions/LessonActions';

// utility methods
import {
    updateStoreList,
    getRoleValue, getStatusValue,
    formatDateString, getGenderValue
} from '../../../utils/utils';

class UserEntry extends React.Component {
    initUpdateEntry(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsUpdating(true);
    }

    initChangePassword(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsChangingPassword(true);
    }

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
            .then(() => this._onEntryDeleted());
    }

    /**
     * Updates group and lesson stores.
     *
     * @private
     */
    _onEntryDeleted() {
        updateStoreList(GroupStore, GroupActions);
        updateStoreList(LessonStore, LessonActions);
    }

    render() {
        const { user, index } = this.props;
        const {
            given_name, family_name,
            email, phone, birthdate,
            picture, gender,
            admin_fields
        } = user;
        const birthdateValue = formatDateString(birthdate);
        const genderValue = getGenderValue(gender);
        const roleValue = getRoleValue(admin_fields.role);
        const status = getStatusValue(admin_fields.is_blocked);
        const memberSinceValue = formatDateString(admin_fields.member_since);
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
                <td>{birthdateValue}</td>
                <td>{genderValue}</td>
                <td>{memberSinceValue}</td>
                <td>{status}</td>
                <td>{roleValue}</td>
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
