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

class PasswordChange extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

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

    _changePassword(password) {
        const { token } = AuthStore.getState();
        const { _id } = this.props.updatable;
        const userProps = { _id, password };

        UserActions.setIsRequesting(true);
        UserActions.update(userProps, token)
            .done(() => {
                UserActions.setIsRequesting(false);
                UserActions.setIsChangingPassword(false);
            })
            .fail(() => {
                UserActions.setIsRequesting(false);
            });
    }

    render() {
        // TODO: add another state (isChangingPassword) and change that in the parent handler
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
