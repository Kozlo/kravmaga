import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup, InputGroup, HelpBlock,
    Glyphicon, FormControl, ControlLabel
} from 'react-bootstrap';

import AuthStore from '../../../stores/AuthStore';
import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';
import PaymentTypeActions from '../../../actions/PaymentTypeActions';

import {
    formatUserDescription,
    initDateTimePicker, handleDateChange
} from '../../../utils/utils';

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
        const { token } = AuthStore.getState();
        const { updatable } = this.props;
        const { paymentDate, validFrom, validTo } = updatable;
        const paymentDateChangeHandler = handleDateChange.bind(this, 'paymentDate', PaymentActions, updatable);
        const validFromChangeHandler = handleDateChange.bind(this, 'validFrom', PaymentActions, updatable);
        const validToChangeHandler = handleDateChange.bind(this, 'validTo', PaymentActions, updatable);

        initDateTimePicker('#paymentDate', paymentDateChangeHandler, paymentDate);
        initDateTimePicker('#validFrom', validFromChangeHandler, validFrom);
        initDateTimePicker('#validTo', validToChangeHandler, validTo);

        PaymentTypeActions.getList(token, PaymentActions.paymentTypesReceived);
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
     * Payment type value changed handler.
     *
     * If the payment type name is not other, updates the amount property as well.
     * Otherwise clears the amount property
     *
     * @public
     * @param {Object} event Event object
     */
    handlePaymentTypeChange(event) {
        const { updatable } = this.props;
        const paymentType = this.paymentTypeFinder(event.target.value);
        const { name, amount, hasCount } = paymentType;

        updatable.paymentType = name;

        if (name === 'other') {
            updatable.amount = '';
        } else {
            updatable.amount = paymentType.amount;
        }

        updatable.totalLessons = '';
        updatable.usedLessons = '';

        PaymentActions.setUpdatable(updatable);
    }

    /**
     * Renders an options for the user select
     *
     * @param {Object} user User object
     * @returns {string} HTML output
     * @public
     */
    renderUserOption(user, index) {
        const userDescription = formatUserDescription(user);

        return (
            <option
                key={`UserPaymentOption${index}`}
                value={user._id}
            >
                {userDescription}
            </option>
        );
    }

    /**
     * Renders an options for the payment type select
     *
     * @param {Object} user PaymentType object
     * @returns {string} HTML output
     * @public
     */
    renderPaymentTypeOption(paymentType, index) {
        const { name, amount, hasCount } = paymentType;
        const paymentDuration = hasCount ? 'par nodarbību skaitu' : 'par periodu';
        const paymentTypeDescription = `${name} (€${amount} ${paymentDuration})`;

        return (
            <option
                key={`PaymentTypeOption${index}`}
                value={paymentType.name}>
                {paymentTypeDescription}
            </option>
        );
    }

    /**
     * Finds the payment type option based on its name.
     *
     * @param {string} paymentTypeName Name of the payment type
     * @returns {PaymentType|Object} Payment type
     * @private
     */
    paymentTypeFinder(paymentTypeName) {
        const { paymentTypes } = this.props;
        const foundPaymentTypes = paymentTypes.filter(paymentType => paymentType.name === paymentTypeName);

        return foundPaymentTypes.length ? foundPaymentTypes[0] : { name: 'other' };
    }

    /**
     * Date changed event handler.
     *
     * @param {string} prop Date property name
     * @param {Date} date Date value
     * @private
     */
    _handleDateChange(prop, date) {
        date = date && date !== 'false' ? date : '';

        this._updateData(prop, date);
    }

    /**
     * Updates the updatable propery value.
     *
     * @param {string} prop Property name
     * @param {Date} value Property value
     * @private
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
        const {
            updatable, users, paymentTypes
        } = this.props;
        const {
            payee, paymentType, amount,
            totalLessons, usedLessons
        } = updatable;
        const paymentTypeHasNoCount = this.paymentTypeFinder(paymentType).hasCount === false;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Maksātājs</ControlLabel>
                            <select className="form-control"
                                    onChange={this.handleChange.bind(this, 'payee')}
                                    value={payee}>
                                <option value=""></option>
                                {users.map(this.renderUserOption.bind(this))}
                            </select>
                            <FormControl.Feedback />
                            <HelpBlock>Lietotājs, kurš veicis maksājumu.</HelpBlock>
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
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Maksājuma tips</ControlLabel>
                            <select className="form-control"
                                    onChange={this.handlePaymentTypeChange.bind(this)}
                                    value={paymentType}>
                                <option value="other">Cits</option>
                                {paymentTypes.map(this.renderPaymentTypeOption.bind(this))}
                            </select>
                            <FormControl.Feedback />
                            <HelpBlock>Definēts maksājuma tips.</HelpBlock>
                        </FormGroup>
                    </Col>
                    {/*TODO: consider adding 'EUR' here (see how it's done elsewhere)*/}
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Maksa</ControlLabel>
                            <InputGroup>
                                <FormControl
                                    type="number"
                                    min="0"
                                    placeholder="Maksa"
                                    value={amount}
                                    onChange={this.handleChange.bind(this, 'amount')}
                                />
                                <InputGroup.Addon>
                                    <Glyphicon glyph="euro" />
                                </InputGroup.Addon>
                            </InputGroup>
                        </FormGroup>
                    </Col>
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
                    {
                        !paymentTypeHasNoCount &&
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
                    }
                    {
                        !paymentTypeHasNoCount &&
                        <Col xs={12}>
                            <FormGroup>
                                <ControlLabel>Izmantoto nodarbību skaits</ControlLabel>
                                <FormControl
                                    type="number"
                                    min="0"
                                    placeholder="Izmantoto nodarbību skaits"
                                    value={usedLessons}
                                    onChange={this.handleChange.bind(this, 'usedLessons')}
                                />
                            </FormGroup>
                        </Col>
                    }
                </Row>
            </div>
        );
    }
}

export default connectToStores(PaymentFields);
