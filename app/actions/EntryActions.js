import {
    httpStatusCode, fetchData,
    getAuthorizationHeader
} from '../utils/utils';


class EntryActions {
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
            'setIsUpdating',
            'setIsCreating',
            'setIsRequesting',
            'setFilters',
            'setLimit',
        );
    }

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

    get(id, token) {
        const statusCode = $.extend({ 200: entry => this.received(entry) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}/${id}`,
            method: 'GET',
        };

        return this._sendRequest(requestProps, token);
    }

    getList(token, successHandler = this.listReceived, filters = {}, limit = null) {
        const statusCode = $.extend({ 200: entries => successHandler(entries)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: this.url,
            method: 'GET',
            data: { filters, limit }
        };

        return this._sendRequest(requestProps, token);
    }

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
