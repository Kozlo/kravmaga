import alt from '../alt';
import EntryActions from './EntryActions';
import { paymentTypeFieldNames, generalConfig } from '../utils/config';
import { createObject } from '../utils/utils';

/**
 * Actions for location data.
 */
class PaymentTypeActions extends EntryActions {
    /**
     * Generates general payment type-specific actions.
     * Assigns the base URL.
     *
     * @param {Object} props Parent object properties
     */
    constructor(props) {
        super(props);

        const { paymentTypesUrl } = generalConfig.api;

        this.url = paymentTypesUrl;
    }

    /**
     * Creates and sets a new updatable based on the passed entry's properties.
     *
     * @public
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(paymentTypeFieldNames, entry);

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(PaymentTypeActions);
