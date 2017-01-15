import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import { Row, Col, Button, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

import { isEmailValid, isValueBoolean } from '../../../utils/utils';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';

class ManageUser extends React.Component {

    static getStores() {
        return [AuthStore, UserStore];
    }

    static getPropsFromStores() {
        return {
            auth: AuthStore.getState(),
            user: UserStore.getState()
        };
    }

    handleChange(prop, event) {
        const { updatable } = this.props.user;

        updatable[prop] = event.target.value;

        UserActions.setUpdatableUser(updatable);
    }

    handleSubmit(event) {
        const { updatable } = this.props.user;
        const { email, is_admin, is_blocked } = updatable;

        event.preventDefault();

        if (isEmailValid(email) && isValueBoolean(is_admin) && isValueBoolean(is_blocked)) {
            this._updateUser(updatable);
        } else {
            toastr.error('Lūdzu aizpildiet visus laukus!');
        }
    }

    getEmailValidationState() {
        const { email } = this.props.user.updatable;
        const emailValid = isEmailValid(email) || '';

        return emailValid ? null : 'error';
    }

    _updateUser(user) {
        const { token } = this.props.auth;

        // TODO: disable submit button and enable back on done

        UserActions
            .updateUser(user, token)
            .done(() => this._closeModal());
    }

    _closeModal() {
        $('#manageUserCloseBtn').click();
    }

    render() {
        const { given_name, family_name, email, is_blocked, is_admin } = this.props.user.updatable;

        return (
            <div className="modal fade" id="userModal" tabIndex="-1" role="dialog" aria-labelledby="User Modal">
                <div className="modal-dialog" role="document">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">Atjaunināt lietotāju</h4>
                            </div>
                            <div className="modal-body">
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>Vārds</ControlLabel>
                                            <FormControl
                                                type="text"
                                                placeholder="Vārds"
                                                value={given_name}
                                                onChange={this.handleChange.bind(this, 'given_name')}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>Uzvārds</ControlLabel>
                                            <FormControl
                                                type="text"
                                                placeholder="Uzvārds"
                                                value={family_name}
                                                onChange={this.handleChange.bind(this, 'family_name')}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup controlId="email" validationState={this.getEmailValidationState()}>
                                            <ControlLabel>E-pasts</ControlLabel>
                                            <FormControl
                                                type="text"
                                                placeholder="E-pasts"
                                                value={email}
                                                onChange={this.handleChange.bind(this, 'email')}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>Statuss</ControlLabel>
                                            <select className="form-control"
                                                    onChange={this.handleChange.bind(this, 'is_blocked')}
                                                    value={is_blocked}>
                                                <option value={false}>Aktīvs</option>
                                                <option value={true}>Bloķēts</option>
                                            </select>
                                            <FormControl.Feedback />
                                            <HelpBlock>Vai lietotājs ir aktīvs vai bloķēts?</HelpBlock>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <ControlLabel>Loma</ControlLabel>
                                            <select className="form-control"
                                                    onChange={this.handleChange.bind(this, 'is_admin')}
                                                    value={is_admin}>
                                                <option value={false}>Lietotājs</option>
                                                <option value={true}>Admins</option>
                                            </select>
                                            <FormControl.Feedback />
                                            <HelpBlock>Vai lietotājs ir admins?</HelpBlock>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div className="modal-footer">
                                <Button id="manageUserCloseBtn"
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal">
                                    Aizvērt
                                </Button>
                                <Button id="submitBtn"
                                        type="submit"
                                        className="btn btn-primary">
                                    Atjaunināt
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connectToStores(ManageUser);
