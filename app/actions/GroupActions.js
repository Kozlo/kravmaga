import alt from '../alt';
import EntryActions from './EntryActions';
import { groupFieldNames, generalConfig } from '../utils/config';
import { httpStatusCode, createObject, encodeJsonUrl } from '../utils/utils';

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

    getMembers(group, token) {
        const { usersUrl } = generalConfig.api;
        const statusCode = Object.assign({ 200: members => this.membersReceived({ groupId: group._id, members }) }, httpStatusCode);
        const filters = { _id: { $in: group.members } };
        const encodedFilters = encodeJsonUrl(filters);
        const url = `${usersUrl}?filters=${encodedFilters}`;
        const requestProps = {
            statusCode, url,
            method: 'GET',
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Creates and sets a new updatable based on the passed entry's properties.
     *
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(groupFieldNames, entry);

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(GroupActions);
