import alt from '../alt';
import EntryActions from './EntryActions';
import { groupFieldNames, generalConfig } from '../utils/config';
import { createObject, httpStatusCode } from '../utils/utils';

/**
 * Actions for group data.
 */
class GroupActions extends EntryActions {
    /**
     * Generates general groups-specific actions.
     * Assigns the base, and user group URLs.
     *
     * @param {Object} props Parent object properties
     */
    constructor(props) {
        super(props);

        const { baseUrl, userGroupUrl } = generalConfig.api.groups;

        this.generateActions(
            'userListReceived',
            'membersReceived',
            'memberAdded',
            'memberRemoved',
        );

        this.url = baseUrl;
        this.userGroupUrl = userGroupUrl;
    }

    /**
     * Adds a user to several groups.
     *
     * @public
     * @param {string} token Auth token
     * @param {string} userId User id
     * @param {string} groupIds Group ids
     * @returns {Promise} Request promise
     */
    addUserToGroups(token, userId, groupIds) {
        return this._updateUserGroups(token, userId, groupIds, 'addUserToGroups');
    }

    /**
     * Adds a user to several groups.
     *
     * @public
     * @param {string} token Auth token
     * @param {string} userId User id
     * @param {string} groupIds Group ids
     * @returns {Promise} Request promise
     */
    removeUserFromGroups(token, userId, groupIds) {
        return this._updateUserGroups(token, userId, groupIds, 'removeUserFromGroups');
    }

    /**
     * Retrieved groups for the specified user.
     *
     * The method relies on jQuery to append the data to the GET request as encoded URI string.
     *
     * @param {string} token Auth token
     * @param {string} userId User id
     * @returns {Promise} Request promise
     */
    getUserGroupList(token, userId) {
        const statusCode = $.extend({ 200: entries => this.listReceived(entries)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}${this.userGroupUrl}/${userId}`,
            method: 'GET'
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

    /**
     * Sends a batch request for adding a user to/removing from several groups
     *
     * @private
     * @param {string} token Auth token
     * @param {string} userId User id
     * @param {string} groupIds Group id
     * @param {string} action Add or remove action
     * @returns {Promise} Request promise
     */
    _updateUserGroups(token, userId, groupIds, action) {
        const requestProps = {
            statusCode: httpStatusCode,
            url: `${this.url}/${action}/${userId}`,
            data: { groupIds },
            method: 'PATCH'
        };

        return this._sendRequest(requestProps, token);
    }
}

export default alt.createActions(GroupActions);
