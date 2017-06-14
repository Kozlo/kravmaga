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
import AuthStore from '../../../stores/AuthStore';
import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';
import UserActions from '../../../actions/UserActions';

// components

// utils & config
import { filterConfig } from '../../../utils/config';
import { updateStoreList, constructUserInfo } from '../../../utils/utils';

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

    componentWillMount() {
        const { token } = AuthStore.getState();

        UserActions.getList(token, PaymentActions.usersReceived);
    }

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
        const { value } = event.target;

        if (value === '') {
            delete filters[prop];
        } else {
            filters[prop] = value;
        }

        PaymentActions.setFilters(filters);

        updateStoreList(PaymentStore, PaymentActions);
    }

    /**
     * Renders a user select option.
     *
     * @public
     * @param {Object} user User to select
     * @param {number} index User index
     * @returns {string} HTML markup
     */
    renderUser(user, index) {
        const { _id, given_name, family_name, email } = user;
        const userInfo = constructUserInfo(email, given_name, family_name);

        return (
            <option
                key={`UserOption${index}`}
                value={_id}>
                {userInfo}
            </option>
        );
    }

    /**
     * Renders payment data filters (and config) form.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { config, users } = this.props;
        const { limit } = config;
        const { min, max } = filterConfig.count;

        return (
            <Row>
                {/*TODO: replace with user list*/}
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Lietotāji</ControlLabel>
                        <FormControl
                            componentClass="select"
                            placeholder="Lietotāji"
                            onChange={this.handleFilterChange.bind(this, 'payee')}>
                            <option value="">Visi</option>
                            {users.map((user, index) => this.renderUser(user, index))}
                        </FormControl>
                        <FormControl.Feedback />
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
