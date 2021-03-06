// dependencies
import React from 'react';
import {
    Row, Col,
    FormGroup, ControlLabel,
    FormControl, InputGroup,
    HelpBlock, Glyphicon
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
import { updateStoreList, constructUserInfo, initDateTimePicker } from '../../../utils/utils';

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
        if (!this.props.userPaymentsOnly) {
            this._getUserList();
        }
    }

    /**
     * Initiates the start time date/time picker.
     *
     * @public
     */
    componentDidMount() {
        const paymentDateChangeHandler = this._handleDateChange.bind(this, 'paymentDate', null);
        const validFromChangeHandler = this._handleDateChange.bind(this, 'validFrom', '$lte');
        const validToChangeHandler = this._handleDateChange.bind(this, 'validTo', '$gte');
        const { validFrom = {}, validTo = {} } = this.props.filters;

        initDateTimePicker('#paymentDateFilter', paymentDateChangeHandler);
        initDateTimePicker('#validFromFilter', validFromChangeHandler, validFrom.$lte);
        initDateTimePicker('#validToFilter', validToChangeHandler, validTo.$gte);
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
        this._updateData();
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
        this._updateData();
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

    _getUserList() {
        const { token } = AuthStore.getState();

        UserActions.getList(token, PaymentActions.usersReceived);
    }
    /**
     * Date filter value changed handler.
     *
     * Makes a new request when a change is made to reflect the change in the data.
     *
     * @private
     * @param {string} prop Name of the filter
     * @param {string|null} operator Operator to use for the filter
     * @param {*} date The new date value
     */
    _handleDateChange(prop, operator, date) {
        const { filters } = this.props;

        date = date && date !== 'false' ? date : '';

        if (date === '') {
            delete filters[prop];
        } else {
            date = new Date(date);
            date.setHours(0, 0, 0, 0);

            if (operator) {
                filters[prop] = { [operator]: date };
            } else {
                filters[prop] = date;
            }
        }

        PaymentActions.setFilters(filters);
        this._updateData();
    }

    /** Determines if all user data should be retrieved (for admins) or single user data (for single user view) */
    _updateData() {
      if (this.props.userPaymentsOnly) {
          this._getSingleUserData();
      } else {
          this._getAllData();
      }
    }

    /** Updates all data (all users) when an admin is searching for them. */
    _getAllData() {
      updateStoreList(PaymentStore, PaymentActions);
    }

    /** Updates data for a single user.*/
    _getSingleUserData() {
      const { token, userId } = AuthStore.getState();
      const { filters, sorters, config } = this.props;

      PaymentActions.getUserPaymentList(token, userId, filters, sorters, config);
    }

    /**
     * Renders payment data filters (and config) form.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { config, users, userPaymentsOnly } = this.props;
        const { limit } = config;
        const { min, max } = filterConfig.count;

        return (
            <Row>
                {
                    !userPaymentsOnly &&
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
                }
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Maksājuma datums</ControlLabel>
                        <InputGroup id='paymentDateFilter'>
                            <FormControl
                                type="text"
                                placeholder="Maksājuma datums"
                            />
                            <InputGroup.Addon>
                                <Glyphicon glyph="calendar" />
                            </InputGroup.Addon>
                        </InputGroup>
                        <HelpBlock>No kura datuma rādīt nodarbības.</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Derīgs no</ControlLabel>
                        <InputGroup id='validFromFilter'>
                            <FormControl
                                type="text"
                                placeholder="No kura datuma maksājums derīgs"
                            />
                            <InputGroup.Addon>
                                <Glyphicon glyph="calendar" />
                            </InputGroup.Addon>
                        </InputGroup>
                        <HelpBlock>No kura datuma maksājums derīgs.</HelpBlock>
                    </FormGroup>
                </Col>
                <Col xs={12} sm={6} lg={3}>
                    <FormGroup>
                        <ControlLabel>Derīgs līdz</ControlLabel>
                        <InputGroup id='validToFilter'>
                            <FormControl
                                type="text"
                                placeholder="Līdz kuram datuma maksājums derīgs"
                            />
                            <InputGroup.Addon>
                                <Glyphicon glyph="calendar" />
                            </InputGroup.Addon>
                        </InputGroup>
                        <HelpBlock>Līdz kuram datumam maksājums derīgs.</HelpBlock>
                    </FormGroup>
                </Col>
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
