import alt from '../alt';
import EntryStore from './EntryStore';
import GroupActions from '../actions/GroupActions';
import { createObject } from '../utils/utils';
import { groupFieldNames } from '../utils/config';

class GroupStore extends EntryStore {
    constructor(props) {
        super(props);

        this.bindActions(GroupActions);
        this.members = [];
        this.updatable = createObject(groupFieldNames, {});
    }

    onMembersReceived(members) {
        this.members = members;
    }

    onMemberAdded(member) {
        this.members.push(member);
    }

    onMemberRemoved(member) {
        const memberIndex = this.members.indexOf(member);

        this.members.splice(memberIndex, 1);
    }

}

export default alt.createStore(GroupStore);
