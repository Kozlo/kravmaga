import alt from '../alt';
import EntryActions from './EntryActions';
import { httpStatusCode, createObject } from '../utils/utils';
import { groupFieldNames } from '../utils/config';

// TODO: move to config
const url = '/groups';

// TODO: try to make an abstract store/actions for data updates
class GroupActions extends EntryActions {
    constructor(props) {
        super(props);

        this.generateActions(
            'membersReceived',
        );

        this.url = url;
    }

    getMembers(id, token) {
        const statusCode = Object.assign({ 200: members => this.membersReceived({ id, members} ) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this._url}?filters=groupId=${id}`,
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
