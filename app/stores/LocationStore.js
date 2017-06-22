import alt from '../alt';
import EntryStore from './EntryStore';
import LocationActions from '../actions/LocationActions';
import { createObject } from '../utils/utils';
import { locationFieldNames } from '../utils/config';

/**
 * Store for location-related data.
 */
class LocationStore extends EntryStore {
    /**
     * Binds store actions to event handlers.
     * Creates objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        this.bindActions(LocationActions);
        this.updatable = createObject(locationFieldNames, {});
    }
}

export default alt.createStore(LocationStore);
