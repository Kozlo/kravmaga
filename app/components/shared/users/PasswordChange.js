import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, ControlLabel, HelpBlock
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
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

    submitHandler(event) {
        const password = event.target.password.value;

        event.preventDefault();

        if (!isPasswordValid(password)) {
            return toastr.error('Parole nav derīga');
        }

        // TODO: validate password (here for testing, with dependency for testing)
        this._changePassword(password);
    }

    _changePassword(password) {
        const { token } = AuthStore.getState();
        const { _id } = this.props.updatable;
        const userProps = { _id, password };

        UserActions.setIsRequesting(true);
        UserActions.updateUser(userProps, token)
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
        const { isRequesting, isChangingPassword, updatable } = this.props;
        const { given_name, family_name, email } = updatable;
        const title = `Paroles maiņa ${given_name} ${family_name} (${email})`;

        return (
            <DataModal
                shouldShow={isChangingPassword}
                title={title}
                closeHandler={this.closeHandler.bind(this)}
                submitHandler={this.submitHandler.bind(this)}
                isDisabled={isRequesting}>
                <Row>
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
                </Row>
            </DataModal>
        );
    }
}

export default connectToStores(PasswordChange);
