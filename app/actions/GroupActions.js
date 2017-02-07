import alt from '../alt';
import EntryActions from './EntryActions';
import { groupFieldNames, generalConfig } from '../utils/config';
import { createObject } from '../utils/utils';

class GroupActions extends EntryActions {
    constructor(props) {
        super(props);

        this.generateActions(
            'membersReceived',
            'memberAdded',
            'memberRemoved',
        );

        this.url = generalConfig.api.groupsUrl;
    }

    /**
     * Creates and sets a new updatable based on the passed entry's properties.
     *
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(groupFieldNames, entry);

        if (Array.isArray(entry.members)) {
            updatable.members = entry.members.slice();
        } else {
            updatable.members = [];
        }

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(GroupActions);
