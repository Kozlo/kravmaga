import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup, InputGroup, HelpBlock,
    Glyphicon, FormControl, ControlLabel
} from 'react-bootstrap';

import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';

import { maxInputLength } from '../../../utils/config';
import { initDateTimePicker, handleDateChange } from '../../../utils/utils';

/**
 * Payment fields presentation component.
 */
class PaymentFields extends React.Component {
    static getStores() {
        return [PaymentStore];
    }

    static getPropsFromStores() {
        return PaymentStore.getState();
    }

    /**
     * Initiates the datetime picker and gets the latest group list (in case it's been updated).
     *
     * @public
     */
    componentDidMount() {
        const { updatable } = this.props;
        const { paymentDate, validFrom, validTo } = updatable;
        const paymentDateChangeHandler = handleDateChange.bind(this, 'paymentDate', PaymentActions, updatable);
        const validFromChangeHandler = handleDateChange.bind(this, 'validFrom', PaymentActions, updatable);
        const validToChangeHandler = handleDateChange.bind(this, 'validTo', PaymentActions, updatable);

        initDateTimePicker('#paymentDate', paymentDateChangeHandler, paymentDate);
        initDateTimePicker('#validFrom', validFromChangeHandler, validFrom);
        initDateTimePicker('#validTo', validToChangeHandler, validTo);
    }

    /**
     * Field value changed handler.
     *
     * @public
     * @param {*} prop Property value
     * @param {Object} event Event object
     */
    handleChange(prop, event) {
        const { updatable } = this.props;

        updatable[prop] = event.target.value;

        PaymentActions.setUpdatable(updatable);
    }

    /**
     * Date changed event handler.
     *
     * @private
     * @param {string} prop Date property name
     * @param {Date} date Date value
     */
    _handleDateChange(prop, date) {
        date = date && date !== 'false' ? date : '';

        this._updateData(prop, date);
    }

    /**
     * Updates the updatable propery value.
     *
     * @private
     * @param {string} prop Property name
     * @param {Date} value Property value
     */
    _updateData(prop, value) {
        const { updatable } = this.props;

        updatable[prop] = value;

        PaymentActions.setUpdatable(updatable);
    }

    /**
     * Renders payment fields.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { updatable } = this.props;
        const {
            payee, paymentType, amount,
            totalLessons, usedLessons
        } = updatable;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        {/*TODO: use a select with all users instead*/}
                        <FormGroup>
                            <ControlLabel>Maksātājs</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Maksātājs"
                                maxLength={maxInputLength.regularField}
                                value={payee}
                                onChange={this.handleChange.bind(this, 'payee')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Maksājuma datums</ControlLabel>
                            <InputGroup id='paymentDate'>
                                <FormControl
                                    type="text"
                                    placeholder="Maksājuma datums"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Datums, kurā maksājums tika veikts.</HelpBlock>
                        </FormGroup>
                    </Col>
                    {/*TODO: add payment type here (need a select here)*/}
                    {/*TODO: differentiate between select payment types and custom ones (might need a combo box OR 2 different controls with an IF*/}
                    {/*TODO: consider adding 'EUR' here (see how it's done elsewhere)*/}
                    {/*<Col xs={12}>*/}
                        {/*<FormGroup>*/}
                            {/*<ControlLabel>Maksa</ControlLabel>*/}
                            {/*<FormControl*/}
                                {/*type="number"*/}
                                {/*min="0"*/}
                                {/*placeholder="Maksa"*/}
                                {/*value={amount}*/}
                                {/*onChange={this.handleChange.bind(this, 'amount')}*/}
                            {/*/>*/}
                        {/*</FormGroup>*/}
                    {/*</Col>*/}
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Derīgs no</ControlLabel>
                            <InputGroup id='validFrom'>
                                <FormControl
                                    type="text"
                                    placeholder="Derīgs no"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Datums no kura lietotājs nodarbības ir apmaksājis.</HelpBlock>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Derīgs līdz</ControlLabel>
                            <InputGroup id='validTo'>
                                <FormControl
                                    type="text"
                                    placeholder="Derīgs līdz"
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="calendar" />
                                </InputGroup.Addon>
                            </InputGroup>
                            <HelpBlock>Datums līdz kuram lietotājs nodarbības ir apmaksājis.</HelpBlock>
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nodarbību skaits</ControlLabel>
                            <FormControl
                                type="number"
                                min="0"
                                placeholder="Nodarbību skaits"
                                value={totalLessons}
                                onChange={this.handleChange.bind(this, 'totalLessons')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Izmantoto nodarbību skaits</ControlLabel>
                            <FormControl
                                type="number"
                                min="0"
                                placeholder="Izmantoto nodarbību skaits"
                                value={usedLessons}
                                onChange={this.handleChange.bind(this, 'totalLessons')}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(PaymentFields);
