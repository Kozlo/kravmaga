import alt from '../alt';
import EntryStore from './EntryStore';
import LocationActions from '../actions/LocationActions';
import { createObject } from '../utils/utils';
import { locationFieldNames } from '../utils/config';

class LocationStore extends EntryStore {
    constructor(props) {
        super(props);

        this.bindActions(LocationActions);
        this.updatable = createObject(locationFieldNames, {});
    }
}

export default alt.createStore(LocationStore);
