import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, Image,
    FormGroup, FormControl,
    ControlLabel, HelpBlock
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import { assets } from '../../../utils/config';

class UserFields extends React.Component {
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
        const {
            given_name,
            family_name,
            picture,
            email,
            phone,
            gender,
        } = this.props.updatable;
        const imgSrc = picture || assets.defaultImage;

        return (
            <div>
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
                        <Image src={imgSrc} responsive />
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
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>E-pasts</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="E-pasts"
                                value={email}
                                onChange={this.handleChange.bind(this, 'email')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Telefona numurs</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Telefona numurs"
                                value={phone}
                                onChange={this.handleChange.bind(this, 'phone')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Dzimums</ControlLabel>
                            <FormControl
                                componentClass="select"
                                placeholder="Dzimums"
                                onChange={this.handleChange.bind(this, 'gender')}
                                value={gender}>
                                <option value=''></option>
                                <option value='male'>Vīrietis</option>
                                <option value='female'>Sieviete</option>
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(UserFields);
