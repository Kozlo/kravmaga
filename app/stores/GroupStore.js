import alt from '../alt';
import EntryStore from './EntryStore';
import GroupActions from '../actions/GroupActions';
import { createObject } from '../utils/utils';
import { groupFieldNames } from '../utils/config';

/**
 * Store for group-related data.
 */
class GroupStore extends EntryStore {
    /**
     * Binds the authentication actions to event handlers.
     * Created objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        this.bindActions(GroupActions);
        this.members = [];
        this.updatable = createObject(groupFieldNames, {});
    }

    /**
     * Group members received handler.
     *
     * This list contains user objects with full data (e.g. name, email etc.).
     *
     * @public
     * @param {Object[]} members Group members list
     */
    onMembersReceived(members) {
        this.members = members;
    }

    /**
     * Member added event handler.
     *
     * @public
     * @param member
     */
    onMemberAdded(member) {
        this.members.push(member);
    }

    /**
     * Member removed event handler.
     *
     * @public
     * @param member
     */
    onMemberRemoved(member) {
        const memberIndex = this.members.indexOf(member);

        this.members.splice(memberIndex, 1);
    }

}

export default alt.createStore(GroupStore);
