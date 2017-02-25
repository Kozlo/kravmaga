import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, ControlLabel, HelpBlock
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import AuthActions from '../../../actions/AuthActions';
import UserActions from '../../../actions/UserActions';
import DataModal from '../DataModal';

import { isPasswordValid } from '../../../utils/utils';

/**
 * Data modal component for changing a user's password.
 *
 * User by both users to change own password and admins for other users.
 */
class PasswordChange extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Modal closed event handler.
     *
     * Sets the is changing password flag to false to close the modal.
     *
     * @public
     */
    closeHandler() {
        UserActions.setIsChangingPassword(false);
    }

    /**
     * Checks if the entered password is valid and sends a request to change it.
     *
     * If the checkPass flag is true, then sends a request to see if the current password is valid correctly.
     *
     * @public
     * @param {boolean} checkPass Flag showing if current password should be checked.
     * @param {Object} event Submit event
     * @returns {*}
     */
    submitHandler(checkPass, email, event) {
        event.preventDefault();

        const form = event.target;

        if (!checkPass) {
            return this._checkEnteredPassword(form);
        }

        const currentPassword = form.currentPassword.value;

        if (!currentPassword) {
            return toastr.error('Lūdzu ievadiet esošo paroli.');
        }

        if (currentPassword === form.password.value) {
            return toastr.error('Vecajai un jaunajai parole jāatšķiras!')
        }

        AuthActions.checkPassword(
            email, currentPassword,
            () => this._checkEnteredPassword(form),
            () => this._passwordCheckFailed()
        );
    }

    /**
     * Shows an error if the user enters the current password incorrectly.
     *
     * @private
     */
    _passwordCheckFailed() {
        toastr.error('Ievadītā esošā parole nav pareiza!');
    }

    /**
     * Checks if the entered values are valid and calls the method to change the password if so.
     *
     * The entered new password must satisfy the complexity rules.
     * The re-entered password must match the first entry.
     *
     * @private
     * @param {Object} form Password change form
     * @returns {*}
     */
    _checkEnteredPassword(form) {
        const password = form.password.value;
        const passwordDoubleCheck = form.passwordDoubleCheck.value;

        if (!isPasswordValid(password)) {
            return toastr.error('Jaunā parole nav derīga');
        }

        if (password !== passwordDoubleCheck) {
            return toastr.error('Jaunā parole atkārtoti ievadīta neprecīzi!');
        }

        this._changePassword(password);
    }

    /**
     * Calls the method to change the password in the back-end.
     *
     * Sets the is requesting flag to true to disable the save button.
     *
     * @private
     * @param {string} password User's new password
     */
    _changePassword(password) {
        const { token } = AuthStore.getState();
        const { _id } = this.props.updatable;
        const userProps = { _id, password };

        UserActions.setIsRequesting(true);
        UserActions.update(userProps, token)
            .done(() => this._onPasswordChanged())
            .fail(() => UserActions.setIsRequesting(false));
    }

    /**
     * Password changed success handler.
     *
     * Sets the is requesting and is changing password flags to false.
     *
     * @private
     */
    _onPasswordChanged() {
        UserActions.setIsRequesting(false);
        UserActions.setIsChangingPassword(false);
    }

    /**
     * Renders a Bootstrap Modal with new password fields.
     *
     * If the checkPass flag is set to true (i.e. when a user is changing own password),
     * the field for checking the existing password is added as well.
     *
     * @public
     * @returns {string} HTML markup for the component
     */
    render() {
        const { isRequesting, isChangingPassword, checkPass, updatable } = this.props;
        const { given_name, family_name, email } = updatable;
        const title = `Paroles maiņa ${given_name} ${family_name} (${email})`;

        return (
            <DataModal
                shouldShow={isChangingPassword}
                title={title}
                closeHandler={this.closeHandler.bind(this)}
                submitHandler={this.submitHandler.bind(this, checkPass, email)}
                isDisabled={isRequesting}>
                <Row>
                    {
                        checkPass &&
                        <Col xs={12}>
                            <FormGroup controlId="currentPassword">
                                <ControlLabel>Esošā parole</ControlLabel>
                                <FormControl
                                    type="password"
                                    placeholder="Esošā parole"
                                />
                                <FormControl.Feedback />
                                <HelpBlock>Šī brīža parole.</HelpBlock>
                            </FormGroup>
                        </Col>
                    }
                    <Col xs={12}>
                        <FormGroup controlId="password">
                            <ControlLabel>Jaunā parole</ControlLabel>
                            <FormControl
                                type="password"
                                placeholder="Jaunā parole"
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Parolei jāsastāv no vismaz 5 simboliem.</HelpBlock>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup controlId="passwordDoubleCheck">
                            <ControlLabel>Jaunā parole vēlreiz</ControlLabel>
                            <FormControl
                                type="password"
                                placeholder="Jaunā parole vēlreiz"
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </DataModal>
        );
    }
}

export default connectToStores(PasswordChange);
