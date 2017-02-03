import alt from '../alt';
import { groupFieldNames } from '../utils/config';
import {
    httpStatusCode, fetchData,
    getAuthorizationHeader, createObject
} from '../utils/utils';

const url = '/groups';

// TODO: try to make an abstract store/actions for data updates
class GroupActions {
    constructor() {
        this.generateActions(
            'created',
            'deleted',
            'updated',
            'updateConflict',
            'listReceived',
            'membersReceived',
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

        return fetchData({
            statusCode, url,
            method: 'POST',
            data: newEntry,
            headers: getAuthorizationHeader(token),
        });
    }

    get(id, token) {
        const statusCode = Object.assign({ 200: entry => this.received(entry) }, httpStatusCode);

        return fetchData({
            statusCode,
            url: `${url}/${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    getList(token) {
        const statusCode = Object.assign({ 200: entries => this.listReceived(entries)}, httpStatusCode);

        return fetchData({
            statusCode, url,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    update(props, token) {
        const statusCode = Object.assign(
            { 200: updatedEntry => this.updated(updatedEntry) },
            httpStatusCode,
            { 409: () => this.updateConflict() }
        );

        return fetchData({
            statusCode,
            url: `${url}/${props._id}`,
            method: 'PATCH',
            data: props,
            headers: getAuthorizationHeader(token)
        });
    }

    delete(id, token) {
        const statusCode = Object.assign({ 200: deletedEntry => this.deleted(deletedEntry) }, httpStatusCode);

        return fetchData({
            statusCode,
            url: `${url}/${id}`,
            method: 'DELETE',
            headers: getAuthorizationHeader(token),
        });
    }

    getMembers(id, token) {
        const statusCode = Object.assign({ 200: members => this.membersReceived({ id, members} ) }, httpStatusCode);

        // TODO: figure out how to filter users with a specific groups correctly

        return fetchData({
            statusCode,
            url: `${url}?filters=groupId=${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
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
