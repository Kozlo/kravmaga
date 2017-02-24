// dependencies
import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

// components
import ManageUser from '../../shared/users/ManageUser';
import UserFields from '../../shared/users/UserFields';
import PasswordChange from '../../shared/users/PasswordChange';

// utility methods and config
import { isUrlValid, createObject, isEmailValid } from '../../../utils/utils';
import { userFieldNames } from '../../../utils/config';

class ProfileActions extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Clears the updatable user.
     * Sets the updating flag to true that triggers the showing of the update modal.
     *
     * @public
     * @param {Object} entry Entry object
     */
    update(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsUpdating(true);
    }

    /**
     * Clears the updatable user.
     * Sets the is changing password flag to true that triggers the password change modal.
     *
     * @public
     * @param {Object} entry Entry object
     */
    initChangePassword(entry) {
        UserActions.clearUpdatable(entry);
        UserActions.setIsChangingPassword(true);
    }

    /**
     * Update user submit handler.
     *
     * Checks if the inputs are valid and send an update request.
     *
     * @public
     * @param {Object} event Submit event
     */
    submitHandler(event) {
        event.preventDefault();

        const { updatable } = this.props;

        if (!this._validateInputs(updatable)) {
            return;
        }

        const { token } = AuthStore.getState();
        const updatableProps = createObject(userFieldNames.general, updatable);

        UserActions.setIsRequesting(true);
        UserActions.update(updatableProps, token)
            .done(() => this._onUserUpdated())
            .fail(() => UserActions.setIsRequesting(false));
    }

    /**
     * User update modal close handler.
     *
     * Sets the is updating flag to false that triggers clsoing of the update modal.
     *
     * @public
     */
    closeHandler() {
        UserActions.setIsUpdating(false);
    }

    /**
     * Checks if the user has entered a valid e-mail.
     * If a picture URL is entered, that it's a valid URl.
     *
     * @private
     * @returns {boolean} Flag showing if the inputs are valid
     */
    _validateInputs(updatable) {
        const { email, picture } = updatable;

        if (!isEmailValid(email)) {
            toastr.error('E-pasts ievadīts kļūdaini!');
            return false;
        }

        if (!isUrlValid(picture) && picture !== '') {
            toastr.error('Profila bildes saitei nav derīga!');
            return false;
        }

        return true;
    }

    /**
     * Sets is updating and is requesting flags to false.
     *
     * @private
     */
    _onUserUpdated() {
        UserActions.setIsUpdating(false);
        UserActions.setIsRequesting(false);
    }

    /**
     * Renders the button toolbar with buttons for changing password and updating profile data.
     *
     * Includes the ManageUser component with regular user fields.
     * Includes PasswordChange component with check pass flag true (i.e. on change a password check should be peformed)
     */
    render() {
        const { entry, isUpdating } = this.props;
        const btnStyle = { float: 'right', marginRight: '10px' };

        return (
            <ButtonToolbar>
                <Button
                    style={btnStyle}
                    onClick={this.update.bind(this, entry)}>
                    Labot Info
                </Button>
                <Button
                    bsStyle="warning"
                    onClick={this.initChangePassword.bind(this, entry)}>
                    Mainīt Paroli
                </Button>
                <ManageUser
                    shouldShow={isUpdating}
                    submitHandler={this.submitHandler.bind(this)}
                    closeHandler={this.closeHandler.bind(this)}>
                    <UserFields />
                </ManageUser>
                <PasswordChange checkPass={true} />
            </ButtonToolbar>
        );
    }
}

export default connectToStores(ProfileActions);
