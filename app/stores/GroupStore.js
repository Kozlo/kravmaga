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

    onMembersReceived(data) {
        const { groupId, members } = data;

        this.members[groupId] = members || [];
    }

    onMemberAdded(data) {
        const { groupId, member } = data;

        this.members[groupId].push(member);
    }

    onMemberRemoved(data) {
        const { groupId, member } = data;
        const groupMembers = this.members[groupId];
        const memberIndex = groupMembers.indexOf(member);

        groupMembers.splice(memberIndex, 1);
    }

}

export default alt.createStore(GroupStore);
