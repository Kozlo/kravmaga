// dependencies
import React from 'react';
import {
    Row, Col,
    FormGroup, ControlLabel,
    FormControl,
    HelpBlock
} from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';

// components

// utils & config
import { filterConfig } from '../../../utils/config';
import { updateStoreList } from '../../../utils/utils';

/**
 * Payment filters data presentation component.
 */
class PaymentFilters extends React.Component {
    static getStores() {
        return [PaymentStore];
    }

    static getPropsFromStores() {
        return PaymentStore.getState();
    }

    // TODO: consider moving this to a util class (also in other components)
    /**
     * Request config changed event handler.
     *
     * Updates the config in the store and makes a new request for data.
     *
     * @public
     * @param {string} prop Name of the property that changed
     * @param {Object} event Event object
     */
    handleConfigChange(prop, event) {
        const { config } = this.props;

        config[prop] = event.target.value;
        PaymentActions.setConfig(config);

        updateStoreList(PaymentStore, PaymentActions);
    }

    // TODO: consider moving this to a util class (also in other components)
    /**
     * Filter changed event handler.
     *
     * @public
     * @param {string} prop Name of the property that changed
     * @param {Object} event Event object
     */
    handleFilterChange(prop, event) {
        const { filters } = this.props;

        filters[prop] = event.target.value;
        PaymentActions.setFilters(filters);

        updateStoreList(PaymentStore, PaymentActions);
    }

    /**
     * Renders payment data filters (and config) form.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { limit } = this.props.config;
        const { min, max } = filterConfig.count;

        return (
            <Row>
                {/*TODO: replace with user list*/}
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Statuss</ControlLabel>
                        <FormControl
                            componentClass="select"
                            placeholder="Statuss"
                            onChange={this.handleFilterChange.bind(this, 'admin_fields.is_blocked')}>
                            <option value="">Visi</option>
                            <option value={false}>Aktīvs</option>
                            <option value={true}>Bloķēts</option>
                        </FormControl>
                        <FormControl.Feedback />
                        <HelpBlock>Vai lietotājs ir aktīvs vai bloķēts?</HelpBlock>
                    </FormGroup>
                </Col>

                {/*TODO: add the following date filters: payment date, valid from, valid to*/}

                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Maksājumu skaits</ControlLabel>
                        <FormControl
                            type="number"
                            placeholder="Maksājumu skaits"
                            min={min}
                            max={max}
                            value={limit}
                            onChange={this.handleConfigChange.bind(this, 'limit')}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>Cik maksājumus rādīt (maks.)?</HelpBlock>
                    </FormGroup>
                </Col>
            </Row>
        );
    }
}

export default connectToStores(PaymentFilters);
