import alt from '../alt';
import EntryStore from './EntryStore';
import PaymentActions from '../actions/PaymentActions';
import { createObject } from '../utils/utils';
import { paymentFieldNames, filterConfig } from '../utils/config';

/**
 * Store for payment-related data.
 */
class PaymentStore extends EntryStore {
    /**
     * Binds store actions to event handlers.
     * Creates objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        const { defaultAmount } = filterConfig.count;

        this.bindActions(PaymentActions);
        this.updatable = createObject(paymentFieldNames, {});
        this.users = [];
        this.paymentTypes = [];
        this.config = { limit: defaultAmount };

        this.onResetFilters();
    }

    /**
     * Users received event handler.
     *
     * @public
     * @param {User[]} users
     */
    onUsersReceived(users) {
        this.users = users;
    }

    /**
     * Payment types received event handler.
     *
     * @public
     * @param {PaymentType[]} paymentTypes
     */
    onPaymentTypesReceived(paymentTypes) {
        this.paymentTypes = paymentTypes;
    }

    /**
     * Resets filters to an initial state.
     *
     * By default only selects active payments (i.e. expiry date is less than or equal to today).
     *
     * @public
     */
    onResetFilters() {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        this.filters = {
            validFrom: { $lte: today },
            validTo: { $gte: today }
        };
    }
}

export default alt.createStore(PaymentStore);
