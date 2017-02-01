import alt from '../alt';
import GroupActions from '../actions/GroupActions';
import { createObject } from '../utils/utils';
import { groupFieldNames } from '../utils/config';

class GroupStore {
    constructor() {
        this.bindActions(GroupActions);

        this.groupList = [];
        this.groupMembers = {};
        this.isUpdating = false;
        this.isCreating = false;
        this.isRequesting = false;
        this.updatable = createObject(groupFieldNames, {});
    }

    onGroupDeleted(deletedGroup) {
        this.groupList.some((group, index) => {
            if (group._id === deletedGroup._id) {
                this.groupList.splice(index, 1);

                return true;
            }
        });

        toastr.success('Grupa veiksmīgi izdzēsta');
    }

    onGroupCreated(group) {
        this.groupList.unshift(group);
    }

    onGroupUpdated(updatedGroup) {
        this.groupList.some((group, index) => {
            if (group._id === updatedGroup._id) {
                this.groupList.splice(index, 1);
                this.groupList.unshift(updatedGroup);

                return true;
            }
        });

        if (this.group._id === updatedGroup._id) {
            this.group = updatedGroup;
        }

        toastr.success('Grupas info veiksmīgi atjaunināta');
    }

    onGroupListReceived(groupList) {
        this.groupList = groupList;
    }

    onSetUpdatableGroup(updatable) {
        this.updatable = updatable;
    }

    onGroupMembersReceived(data) {
        const { groupId, groupMembers } = data;

        this.groupMembers[groupId] = groupMembers;
    }

    onSetIsUpdating(isUpdating) {
        this.isUpdating = isUpdating;
    }

    onSetIsCreating(isUpdating) {
        this.isCreating = isUpdating;
    }

    onSetIsChangingPassword(isChangingPassword) {
        this.isChangingPassword = isChangingPassword;
    }

    onSetIsRequesting(isRequesting) {
        this.isRequesting = isRequesting;
    }

    onGroupUpdateConflict() {
        toastr.error('Grupa ar norādīto nosaukumu jau eksistē');
    }
}

export default alt.createStore(GroupStore, 'GroupStore');
