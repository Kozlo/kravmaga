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

        this.generateActions();

        this.url = generalConfig.api.paymentsUrl;
    }

    /**
     * Creates and sets a new updatable based on the passed payment's properties.
     *
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(paymentFieldNames, entry);

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(UserActions);
