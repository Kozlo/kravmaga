import { groupFieldNames } from '../utils/config';
import {
    httpStatusCode, fetchData,
    getAuthorizationHeader, createObject
} from '../utils/utils';


class EntryActions {
    constructor() {
        this.generateActions(
            'created',
            'deleted',
            'updated',
            'updateConflict',
            'listReceived',
            'setUpdatable',
            'setIsUpdating',
            'setIsCreating',
            'setIsRequesting',
        );
    }

    create(props, token) {
        const statusCode = Object.assign(
            { 201: entry => this.created(entry)},
            httpStatusCode,
            { 409: () => this.updateConflict() }
        );
        const newEntry = Object.assign({}, props);
        delete newEntry._id;
        const requestProps = {
            statusCode,
            url: this._url,
            method: 'POST',
            data: newEntry,
        };

        return fetchData(requestProps, token);
    }

    get(id, token) {
        const statusCode = Object.assign({ 200: entry => this.received(entry) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this._url}/${id}`,
            method: 'GET',
        };

        return this._sendRequest(requestProps, token);
    }

    getList(token) {
        const statusCode = Object.assign({ 200: entries => this.listReceived(entries)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: this._url,
            method: 'GET',
        };

        return this._sendRequest(requestProps, token);
    }

    update(props, token) {
        const statusCode = Object.assign(
            { 200: updatedEntry => this.updated(updatedEntry) },
            httpStatusCode,
            { 409: () => this.updateConflict() }
        );
        const requestProps = {
            statusCode,
            url: `${this._url}/${props._id}`,
            method: 'PATCH',
            data: props,
        };

        return this._sendRequest(requestProps, token);
    }

    delete(id, token) {
        const statusCode = Object.assign({ 200: deletedEntry => this.deleted(deletedEntry) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this._url}/${id}`,
            method: 'DELETE',
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

    /**
     * Sends a request to the API with the given request props and token.
     *
     * @private
     * @param {Object} requestProps Propertiee for request specification
     * @param {string} token JWT token
     * @returns {Promise} Request promise
     */
    _sendRequest(requestProps, token) {
        const request = Object.assign(requestProps, {
            headers: getAuthorizationHeader(token),
        });

        return fetchData(request);
    }
}

export default EntryActions;
