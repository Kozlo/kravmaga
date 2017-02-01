import alt from '../alt';
import {
    httpStatusCode, fetchData,
    getAuthorizationHeader,
} from '../utils/utils';

class GroupActions {
    constructor() {
        this.generateActions(
            'groupCreated',
            'groupDeleted',
            'groupUpdated',
            'groupUpdateConflict',
            'groupListReceived',
            'groupMembersReceived',
            'setUpdatableGroup',
            'setIsUpdating',
            'setIsCreating',
            'setIsRequesting',
        );
    }

    createGroup(props, token) {
        const statusCode = Object.assign({ 201: group => this.groupCreated(group)}, httpStatusCode);
        const newGroup = Object.assign({}, props);

        delete newGroup._id;

        return fetchData({
            statusCode,
            url: '/groups',
            method: 'POST',
            data: newGroup,
            headers: getAuthorizationHeader(token),
        });
    }

    getGroup(id, token) {
        const statusCode = Object.assign({ 200: group => this.groupReceived(group) }, httpStatusCode);

        return fetchData({
            statusCode,
            url: `/groups/${id}`,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    getGroupList(token) {
        const statusCode = Object.assign({ 200: groups => this.groupListReceived(groups)}, httpStatusCode);

        return fetchData({
            statusCode,
            url: '/groups',
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    updateGroup(props, token) {
        const statusCode = Object.assign(
            { 200: updatedGroup => this.groupUpdated(updatedGroup) },
            httpStatusCode,
            { 409: () => this.groupUpdateConflict() }
        );

        return fetchData({
            statusCode,
            url: `/groups/${props._id}`,
            method: 'PATCH',
            data: props,
            headers: getAuthorizationHeader(token)
        });
    }

    deleteGroup(id, token) {
        const statusCode = Object.assign({ 200: deletedGroup => this.groupDeleted(deletedGroup) }, httpStatusCode);

        return fetchData({
            statusCode,
            url: `/groups/${id}`,
            method: 'DELETE',
            headers: getAuthorizationHeader(token),
        });
    }

    getGroupMembers(groupId, token) {
        const statusCode = Object.assign({ 200: groupMembers => this.groupMembersReceived({ groupId, groupMembers} ) }, httpStatusCode);

        // TODO: figure out how to filter users with a specific groups correctly

        return fetchData({
            statusCode,
            url: `/users?filters=groupId${groupId}`,
            method: 'GET',
            headers: getAuthorizationHeader(token),
        });
    }

    /**
     * Creates and sets a new updatable group based on the passed group's properties.
     *
     * @param {Object} group Group to take the properties from
     * @returns {Promise}
     */
    clearUpdatableGroup(group) {
        const updatableGroup = Object.assign({}, group);

        return this.setUpdatableGroup(updatableGroup);
    }
}

export default alt.createActions(GroupActions);
