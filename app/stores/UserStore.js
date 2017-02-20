import alt from '../alt';
import EntryStore from './EntryStore';
import UserActions from '../actions/UserActions';
import { createObject } from '../utils/utils';
import { userFieldNames, filterConfig } from '../utils/config';

class UserStore extends EntryStore {
    constructor(props) {
        const { general, admin_fields } = userFieldNames;
        const { defaultAmount } = filterConfig.users.count;

        super(props);

        this.bindActions(UserActions);

        this.isChangingPassword = false;
        this.updatable = createObject(general, {});
        this.updatable.admin_fields = createObject(admin_fields, {});
        this.groupList = [];
        this.userGroupIds = [];
        this.config = { limit: defaultAmount };
    }

    onSetIsChangingPassword(isChangingPassword) {
        this.isChangingPassword = isChangingPassword;
    }

    onUpdateConflict() {
        toastr.error('Lietotājs ar norādīto e-pastu jau eksistē');
    }

    /**
     * Event handler for receiving a list of groups that can be added to a user.
     *
     * @public
     * @param {Object[]} groupList All available groups
     */
    onGroupListReceived(groupList) {
        this.groupList = groupList;
    }

    /**
     * User groups received handler.
     *
     * Maps the groups to have the group IDs.
     *
     * @public
     * @param {Object[]} userGroups Groups the updatable user is a member of
     */
    onUserGroupsReceived(userGroups) {
        this.userGroupIds = userGroups.map(group => group._id);
    }

    /**
     * Event handler for adding a group id to an updatable user's group list.
     *
     * @param {string} userGroup Group id
     */
    onUserGroupIdAdded(userGroup) {
        this.userGroupIds.push(userGroup);
    }

    /**
     * Event handler for removing a group id from an updatable user's group list.
     *
     * @param {string} userGroup Group id
     */
    onUserGroupIdRemoved(userGroupId) {
        const userGroupIdIndex = this.userGroupIds.indexOf(userGroupId);

        this.userGroupIds.splice(userGroupIdIndex, 1);
    }

    onSetViewableUserId(viewableUserId) {
        this.viewableUserId = viewableUserId;
    }

    onClearViewableUserId() {
        this.viewableUserId = undefined;
    }
}

export default alt.createStore(UserStore);
