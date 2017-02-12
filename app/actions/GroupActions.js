import alt from '../alt';
import EntryActions from './EntryActions';
import { groupFieldNames, generalConfig } from '../utils/config';
import { createObject, httpStatusCode } from '../utils/utils';

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
     * Adds a user to a group.
     *
     * @public
     * @param {string} token Auth token
     * @param {string} groupId Group id
     * @param {string} memberId User id
     * @returns {Promise} Request promise
     */
    addMember(token, groupId, memberId) {
        return this._updateMembership(token, groupId, memberId, 'addMember');
    }

    /**
     * Removes a member from a group.
     *
     * @public
     * @param {string} token Auth token
     * @param {string} groupId Group id
     * @param {string} memberId User id
     * @returns {Promise} Request promise
     */
    removeMember(token, groupId, memberId) {
        return this._updateMembership(token, groupId, memberId, 'removeMember');
    }

    /**
     * Calls the method to add or remove a member from a group.
     *
     * @private
     * @param {string} token Auth token
     * @param {string} groupId Group id
     * @param {string} memberId User id
     * @param {string} action Action to perform
     * @returns {Promise} Request promise
     */
    _updateMembership(token, groupId, memberId, action) {
        const statusCode = $.extend({ 200: updatedEntry => this.updated(updatedEntry)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}/${groupId}/${action}/${memberId}`,
            method: 'PATCH',
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Creates and sets a new updatable based on the passed entry's properties.
     *
     * @public
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
