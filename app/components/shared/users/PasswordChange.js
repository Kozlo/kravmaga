import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, Image,
    FormGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import DataModal from '../DataModal';

class PasswordChange extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        UserActions.setUpdatableUser(updatable);
    }

    render() {
        // TODO: add another state (isChangingPassword) and change that in the parent handler
        const { updatable, isRequesting } = this.props;
        const {
            given_name, family_name,
            email, password
        } = this.props.updatable;
        const title = `Paroles maiņa ${given_name} ${family_name} (${email})'`;

        return (
            <DataModal
                shouldShow=""
                title={title}
                closeHandler=""
                submitHandler=""
                isDisabled={isRequesting}>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Paroles maiņa</ControlLabel>
                            <FormControl
                                type="password"
                                placeholder="Parole"
                                value={password}
                                onChange={this.handleChange.bind(this, 'password')}
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
