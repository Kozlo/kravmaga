import alt from '../alt';
import EntryStore from './EntryStore';
import PaymentActions from '../actions/PaymentActions';
import { createObject } from '../utils/utils';
import { paymentFieldNames } from '../utils/config';

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

        this.bindActions(PaymentActions);
        this.updatable = createObject(paymentFieldNames, {});
        this.users = [];
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
}

export default alt.createStore(PaymentStore);