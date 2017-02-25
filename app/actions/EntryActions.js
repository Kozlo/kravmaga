import {
    httpStatusCode, fetchData,
    getAuthorizationHeader
} from '../utils/utils';

/**
 * Re-usable actions used by different sections (users, lessons, groups, etc.)
 */
class EntryActions {
    /**
     * Generated general re-usable actions.
     */
    constructor() {
        this.generateActions(
            'received',
            'created',
            'updated',
            'silentUpdated',
            'deleted',
            'updateConflict',
            'listReceived',
            'setUpdatable',
            'setFilters',
            'setSorters',
            'setConfig',
            'setIsUpdating',
            'setIsCreating',
            'setIsRequesting',
        );
    }

    /**
     * Sends a request for creating a new entry.
     *
     * @public
     * @param {Object} props Entry properties
     * @param {string} token Authentication token
     * @returns {Promise} Request promise
     */
    create(props, token) {
        const statusCode = $.extend(
            { 201: entry => this.created(entry)},
            httpStatusCode,
            { 409: () => this.updateConflict() }
        );
        const newEntry = $.extend({}, props);
        delete newEntry._id;
        const requestProps = {
            statusCode,
            url: this.url,
            method: 'POST',
            data: newEntry,
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Sends a request to get an existing entry.
     *
     * @public
     * @param {string} id Entry ID
     * @param {string} token Authentication token
     * @returns {Promise} Request promise
     */
    get(id, token) {
        const statusCode = $.extend({ 200: entry => this.received(entry) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}/${id}`,
            method: 'GET',
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Retrieve a list of entries.
     *
     * @public
     * @param {string} token Auth token
     * @param {Function} [successHandler] Success handler
     * @param {Object} [filters] Entry filters
     * @param {Object} [sorters] Entry sorters
     * @param {Object} [config] Entry config
     * @returns {Promise} Request promise
     */
    getList(token, successHandler = this.listReceived, filters = {}, sorters = {}, config = {}) {
        const statusCode = $.extend({ 200: entries => successHandler(entries)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: this.url,
            method: 'GET',
            data: { filters, sorters, config }
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Sends a request to update an existing entry.
     *
     * @public
     * @param {Object} props Entry properties to update
     * @param {string} token Authentication token
     * @returns {Promise} Request promise
     */
    update(props, token) {
        const statusCode = $.extend(
            { 200: updatedEntry => this.updated(updatedEntry) },
            httpStatusCode,
            { 409: () => this.updateConflict() }
        );
        const requestProps = {
            statusCode,
            url: `${this.url}/${props._id}`,
            method: 'PATCH',
            data: props,
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Sends a request to delete an entry.
     *
     * @public
     * @param {string} id Entry ID
     * @param {string} token Authentication token
     * @returns {Promise} Request promise
     */
    delete(id, token) {
        const statusCode = $.extend({ 200: deletedEntry => this.deleted(deletedEntry) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}/${id}`,
            method: 'DELETE',
        };

        return this._sendRequest(requestProps, token);
    }

    /**
     * Sends a request to the API with the given request props and token.
     *
     * @private
     * @param {Object} requestProps Propertiee for request specification
     * @param {string} token JWT token
     * @returns {Promise} Request promise
     */
    _sendRequest(requestProps, token) {
        const request = $.extend(requestProps, {
            headers: getAuthorizationHeader(token),
        });

        return fetchData(request);
    }
}

export default EntryActions;
