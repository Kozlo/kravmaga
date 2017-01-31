import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, Image, Glyphicon,
    FormGroup, FormControl, InputGroup,
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

    /////////////////////////////////////////////////////////////

    // TODO: add componentWillReceiveProps to see if values can be passed to datetime picker without binding the string to the control itself

    componentDidMount() {
        this.initDateTimePicker('#memberSince', this.handleDateChange.bind(this));
    }

    initDateTimePicker(datetimePickerSelector, dateChangedHandler) {
        $(() => {
            const dateTimePicker = $(datetimePickerSelector);

            // TODO: move the format to config and re-use
            dateTimePicker.datetimepicker({
                format: 'DD/MM/YYYY'
            });
            dateTimePicker.on("dp.change", e => dateChangedHandler(e.date));
        });

        $(datetimePickerSelector).show('slow', function() {
            $(this).trigger('isVisible');
        });
    }

    handleDateChange(date) {
        // TODO: see if this is necessary or can be replaced by regular change handler
        date = date && date !== 'false' ? date : '';

        this._updateData('timestamp', date);
    }

    _updateData(prop, value) {
        // TODO: see if this is necessary or can be replaced by regular change handler
        const user = this.props.updatable;

        user[prop] = value;
debugger;
        UserActions.setUpdatableUser(user);
    }

    /////////////////////////////////////////////////////////////

    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        UserActions.setUpdatableUser(updatable);
    }

    render() {
        const {
            picture,
            given_name, family_name,
            email, phone,
            gender, member_since
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
                                type="email"
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
                                type="tel"
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
                    <Col xs={12}>
                        <FormGroup controlId="timestamp">
                            <ControlLabel>Kluba biedrs no</ControlLabel>
                            <InputGroup id='memberSince'>
                                <FormControl
                                    type="text"
                                    placeholder="Datums"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Datums no kura lietotājs ir kluba biedrs.</HelpBlock>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(UserFields);
