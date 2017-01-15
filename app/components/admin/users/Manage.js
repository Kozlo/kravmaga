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
        const { email } = updatable;

        event.preventDefault();

        if (this._getIsEmailValidOrEmpty(email)) {
            this._updateUser(updatable);
        } else {
            toastr.error('Lūdzu aizpildiet visus nepieciešamos laukus!');
        }
    }

    getEmailValidationState() {
        const { email } = this.props.user.updatable;

        return this._getIsEmailValidOrEmpty(email) ? null : 'error';
    }

    _getIsEmailValidOrEmpty(email) {
        return isEmailValid(email) || email === '';
    }

    _updateUser(user) {
        const { token } = this.props.auth;

        $('#manageUserSubmitBtn').prop('disabled', true);

        UserActions
            .updateUser(user, token)
            .done(() => this._onReplyReceived())
            .fail(() => this._onReplyReceived());

    }

    _onReplyReceived() {
        $('#manageUserCloseBtn').click();
        $('#manageUserSubmitBtn').prop('disabled', false);
    }

    render() {
        const { given_name, family_name, email, gender, picture, is_blocked, is_admin } = this.props.user.updatable;
        const imageStyle = { maxWidth: '100%' };

        return (
            <div className="modal fade" id="userModal" tabIndex="-1" role="dialog" aria-labelledby="User Modal">
                <div className="modal-dialog" role="document">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 className="modal-title">{given_name} {family_name}</h4>
                            </div>
                            <div className="modal-body">
                                <Row>
                                    <Col xs={8}>
                                        <FormGroup>
                                            <ControlLabel>Bilde</ControlLabel>
                                            <FormControl
                                                type="text"
                                                placeholder="Bilde"
                                                value={picture}
                                                onChange={this.handleChange.bind(this, 'picture')}
                                            />
                                            <FormControl.Feedback />
                                            <HelpBlock>Saite uz lietotāja bildi.</HelpBlock>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={4}>
                                        <img src={picture} alt="User Image" style={imageStyle} />
                                    </Col>
                                </Row>
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
                                            <ControlLabel>Dzimums</ControlLabel>
                                            <select className="form-control"
                                                    onChange={this.handleChange.bind(this, 'gender')}
                                                    value={gender}>
                                                <option value='male'>Vīrietis</option>
                                                <option value='female'>Sieviete</option>
                                            </select>
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
                                        data-dismiss="modal">Aizvērt</Button>
                                <Button id="manageUserSubmitBtn"
                                        type="submit"
                                        className="btn btn-primary">Atjaunināt</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connectToStores(ManageUser);
