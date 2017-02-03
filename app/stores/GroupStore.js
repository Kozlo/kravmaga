import alt from '../alt';
import GroupActions from '../actions/GroupActions';
import { createObject } from '../utils/utils';
import { groupFieldNames } from '../utils/config';

const entryName = 'Grupa';

class GroupStore {
    constructor() {
        this.bindActions(GroupActions);

        this.list = [];
        // TODO: leave 'members' as group-specific
        this.members = {};
        this.isUpdating = false;
        this.isCreating = false;
        this.isRequesting = false;
        this.updatable = createObject(groupFieldNames, {});
    }

    onDeleted(deletedEntry) {
        this.list.some((entry, index) => {
            if (entry._id === deletedEntry._id) {
                this.list.splice(index, 1);

                return true;
            }
        });

        toastr.success(`${entryName} veiksmīgi izdzēsta`);
    }

    onCreated(entry) {
        this.list.unshift(entry);
    }

    onUpdated(updatedEntry) {
        this.list.some((entry, index) => {
            if (entry._id === updatedEntry._id) {
                this.list.splice(index, 1);
                this.list.unshift(updatedEntry);

                return true;
            }
        });

        toastr.success('Info veiksmīgi atjaunināta');
    }

    onListReceived(list) {
        this.list = list;
    }

    onSetUpdatable(updatable) {
        this.updatable = updatable;
    }

    // TODO: leave this as group-specific
    onMembersReceived(data) {
        const { groupId, groupMembers } = data;

        this.members[groupId] = groupMembers;
    }

    onSetIsUpdating(isUpdating) {
        this.isUpdating = isUpdating;
    }

    onSetIsCreating(isUpdating) {
        this.isCreating = isUpdating;
    }

    onSetIsRequesting(isRequesting) {
        this.isRequesting = isRequesting;
    }

    onUpdateConflict() {
        toastr.error(`${entryName} jau eksistē`);
    }
}

export default alt.createStore(GroupStore, 'GroupStore');
