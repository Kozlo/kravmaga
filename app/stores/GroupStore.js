import alt from '../alt';
import EntryStore from './EntryStore';
import GroupActions from '../actions/GroupActions';
import { createObject } from '../utils/utils';
import { groupFieldNames } from '../utils/config';

class GroupStore extends EntryStore {
    constructor(props) {
        super(props);

        this.bindActions(GroupActions);
        this.members = {};
        this.updatable = createObject(groupFieldNames, {});
    }

    // TODO: leave this as group-specific
    onMembersReceived(data) {
        const { groupId, groupMembers } = data;

        this.members[groupId] = groupMembers;
    }
}

export default alt.createStore(GroupStore);
