import alt from '../alt';
import EntryActions from './EntryActions';
import { locationFieldNames, generalConfig } from '../utils/config';
import { createObject } from '../utils/utils';

/**
 * Actions for location data.
 */
class LocationActions extends EntryActions {
    /**
     * Generates general location-specific actions.
     * Assigns the base URL.
     *
     * @param {Object} props Parent object properties
     */
    constructor(props) {
        super(props);

        const { locationsUrl } = generalConfig.api;

        this.url = locationsUrl;
    }

    /**
     * Creates and sets a new updatable based on the passed entry's properties.
     *
     * @public
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(locationFieldNames, entry);

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(LocationActions);
