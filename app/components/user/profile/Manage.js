import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, Button, Modal,
    FormGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap';

import { isEmailValid } from '../../../utils/utils';

import AuthStore from '../../../stores/AuthStore';
import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import { assets } from '../../../utils/config';

class ManageUser extends React.Component {
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

    handleSubmit(event) {
        const { updatable } = this.props;

        event.preventDefault();

        if (!isEmailValid(updatable.email)) {
            return toastr.error('E-pasts ievadīts kļūdaini!');
        }

        this._updateUser(updatable);
    }

    _updateUser(user) {
        const { token } = AuthStore.getState();
        const userProps = Object.assign({}, user);

        delete userProps.admin_fields;

        $('#manageUserSubmitBtn').prop('disabled', true);

        UserActions
            .updateUser(userProps, token)
            .then(() => this._onReplyReceived())
    }

    _onReplyReceived() {
        $('#manageProfileCloseBtn').click();
        $('#manageProfileSubmitBtn').prop('disabled', false);
    }

    render() {
        const { given_name, family_name, email, picture, phone, gender } = this.props.updatable;
        const imgSrc = picture || assets.defaultImage;
        const imageStyle = { maxWidth: '100%' };

        // TODO: replace default modal attrs with react-bootstrap
        // TODO: move the general fields to a separate (common component) and re-use for profile and user update modals
        // TODO: re-use the modal as well, but separate by passing child props (general fields for profile and additionally admin fields for user update)
        return (
            <div className="modal fade" id="profileModal" tabIndex="-1" role="dialog" aria-labelledby="Profile Modal">
                <div className="modal-dialog" role="document">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <Button className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></Button>
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
                                            <HelpBlock>Saite uz manu profila bildi.</HelpBlock>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={4}>
                                        <img src={imgSrc} alt="User Image" style={imageStyle} />
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
                                        <FormGroup controlId="email">
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
                                        <FormGroup controlId="phone">
                                            <ControlLabel>Telefona numurs</ControlLabel>
                                            <FormControl
                                                type="text"
                                                placeholder="Telefona numurs"
                                                value={phone}
                                                onChange={this.handleChange.bind(this, 'phone')}
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
                                                <option value=''></option>
                                                <option value='male'>Vīrietis</option>
                                                <option value='female'>Sieviete</option>
                                            </select>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div className="modal-footer">
                                <Button id="manageProfileCloseBtn"
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal">Aizvērt</Button>
                                <Button id="manageProfileSubmitBtn"
                                        type="submit"
                                        className="btn btn-primary">Saglabāt</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connectToStores(ManageUser);
