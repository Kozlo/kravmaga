import alt from '../alt';
import EntryStore from './EntryStore';
import PaymentTypeActions from '../actions/PaymentTypeActions';
import { createObject } from '../utils/utils';
import { paymentTypeFieldNames } from '../utils/config';

/**
 * Store for payment type-related data.
 */
class PaymentTypeStore extends EntryStore {
    /**
     * Binds store actions to event handlers.
     * Creates objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        this.bindActions(PaymentTypeActions);
        this.updatable = createObject(paymentTypeFieldNames, {});
    }
}

export default alt.createStore(PaymentTypeStore);
