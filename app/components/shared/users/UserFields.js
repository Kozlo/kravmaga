import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, Image, Glyphicon,
    FormGroup, FormControl, InputGroup,
    ControlLabel, HelpBlock
} from 'react-bootstrap';

import UserStore from '../../../stores/UserStore';
import UserActions from '../../../actions/UserActions';
import { assets , maxInputLength } from '../../../utils/config';
import { initDateTimePicker, handleDateChange } from '../../../utils/utils';

/**
 * Component for rendering general user properties editable by admins and users for their own profiles.
 */
class UserFields extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Initiates the birthdate date picker.
     *
     * @public
     */
    componentDidMount() {
        const { updatable } = this.props;
        const { birthdate } = updatable;
        const dateChangeHandler = handleDateChange.bind(this, 'birthdate', UserActions, updatable);

        initDateTimePicker('#birthdate', dateChangeHandler, birthdate);
    }

    /**
     * Sets the changed updatable user property value.
     *
     * Updates the store to reflect the updatable object changes.
     *
     * @public
     * @param {*} prop Property value
     * @param {Object} event Change event
     */
    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        UserActions.setUpdatable(updatable);
    }

    /**
     * Renders editable user fields as form controls.
     *
     * @public
     * @returns {string} HTML markup for the component
     */
    render() {
        const {
            picture,
            given_name, family_name,
            email, phone,
            gender
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
                                maxLength={maxInputLength.url}
                                onChange={this.handleChange.bind(this, 'picture')}
                            />
                            <FormControl.Feedback />
                            <HelpBlock>Saite uz profila bildi.</HelpBlock>
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
                                maxLength={maxInputLength.regularField}
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
                                maxLength={maxInputLength.regularField}
                                onChange={this.handleChange.bind(this, 'family_name')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>E-pasts</ControlLabel>
                            <FormControl
                                type="email"
                                placeholder="E-pasts"
                                value={email}
                                maxLength={maxInputLength.email}
                                onChange={this.handleChange.bind(this, 'email')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Telefona numurs</ControlLabel>
                            <FormControl
                                type="tel"
                                placeholder="Telefona numurs"
                                value={phone}
                                maxLength={maxInputLength.phone}
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
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Dzimšanas datums</ControlLabel>
                            <InputGroup id='birthdate'>
                                <FormControl
                                    type="text"
                                    placeholder="Datums"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Lietotāja dzimšanas datusm.</HelpBlock>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(UserFields);
