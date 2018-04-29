import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import {
    Row, Col, FormGroup,
    FormControl, ControlLabel,
    ToggleButtonGroup, ToggleButton
} from 'react-bootstrap';

import PaymentTypeStore from '../../../../stores/PaymentTypeStore';
import PaymentTypeActions from '../../../../actions/PaymentTypeActions';

import { maxInputLength } from '../../../../utils/config';

/**
 * Payment type fields presentation component.
 */
class PaymentTypeFields extends React.Component {
    static getStores() {
        return [PaymentTypeStore];
    }

    static getPropsFromStores() {
        return PaymentTypeStore.getState();
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

        PaymentTypeActions.setUpdatable(updatable);
    }

    /**
     * Checkbox field value changed handler.
     *
     * @public
     * @param {*} prop Property value
     * @param {boolean} value Entry has count
     */
    handleCheckboxChange(prop, value) {
        const { updatable } = this.props;

        updatable[prop] = value;

        PaymentTypeActions.setUpdatable(updatable);
    }

    /**
     * Renders payment type fields.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { updatable } = this.props;
        const { name, amount, hasCount } = updatable;

        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Nosaukums</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="Nosaukums"
                                maxLength={maxInputLength.regularField}
                                value={name}
                                onChange={this.handleChange.bind(this, 'name')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Maksa (EUR)</ControlLabel>
                            <FormControl
                                type="number"
                                min="0"
                                placeholder="Maksa"
                                value={amount}
                                onChange={this.handleChange.bind(this, 'amount')}
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel>Vai tipam ir izmantošanas reizes?</ControlLabel>
                            <br />
                            <ToggleButtonGroup
                                type="radio"
                                name="hasCount"
                                defaultValue={hasCount}
                                onChange={this.handleCheckboxChange.bind(this, 'hasCount')}>
                                <ToggleButton value={true}>Jā</ToggleButton>
                                <ToggleButton value={false}>Nē</ToggleButton>
                            </ToggleButtonGroup>
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connectToStores(PaymentTypeFields);
