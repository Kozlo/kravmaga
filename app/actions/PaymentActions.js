import alt from '../alt';
import EntryActions from './EntryActions';
import { paymentFieldNames, generalConfig } from '../utils/config';
import { createObject } from '../utils/utils';

/**
 * Actions for user data.
 */
class UserActions extends EntryActions {
    /**
     * Generates general payment-specific actions.
     * Assigns the base URL.
     *
     * @param {Object} props Parent object properties
     */
    constructor(props) {
        super(props);

        const { baseUrl, userPaymentUrl } = generalConfig.api.payments;

        this.generateActions(
            'usersReceived',
            'paymentTypesReceived',
            'resetFilters',
        );

        this.url = baseUrl;
        this.userPaymentUrl = userPaymentUrl;
    }

    /**
     * Retrieved payments for the specified user.
     *
     * The method relies on jQuery to append the data to the GET request as encoded URI string.
     *
     * @param {string} token Auth token
     * @param {string} userId User id
     * @param {Object} [filters] Entry filters
     * @param {Object} [sorters] Entry sorters
     * @param {number} [config] Entry limit per request
     * @returns {Promise} Request promise
     */
    getUserPaymentList(token, userId, filters, sorters, config) {
        const statusCode = $.extend({ 200: entries => this.listReceived(entries)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}${this.userPaymentUrl}/${userId}`,
            method: 'GET',
            data: { filters, sorters, config }
        };

        return this._sendRequest(requestProps, token);

    }

    /**
     * Creates and sets a new updatable based on the passed payment's properties.
     *
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(paymentFieldNames, entry);

        updatable.paymentType = 'other';

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(UserActions);
