import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup, Checkbox,
    FormControl, ControlLabel
} from 'react-bootstrap';

import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';

import { maxInputLength } from '../../../utils/config';

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
     * Renders payment fields.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { updatable } = this.props;
        const {
            payee, paymentDate, paymentType,
            amount, validFrom, validTo,
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
                    {/*TODO: add payment date here (need a date control) */}
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
                    {/*TODO: add valid from here (need a date control) */}
                    {/*TODO: add valid to here (need a date control) */}
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
