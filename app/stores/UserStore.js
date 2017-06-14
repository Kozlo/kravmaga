import alt from '../alt';
import EntryStore from './EntryStore';
import UserActions from '../actions/UserActions';
import { createObject } from '../utils/utils';
import { userFieldNames, filterConfig } from '../utils/config';

/**
 * Store for user-related data.
 */
class UserStore extends EntryStore {
    /**
     * Binds store actions to event handlers.
     * Creates objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        const { general, admin_fields } = userFieldNames;
        const { defaultAmount } = filterConfig.count;

        this.bindActions(UserActions);

        this.isChangingPassword = false;
        this.updatable = createObject(general, {});
        this.updatable.admin_fields = createObject(admin_fields, {});
        this.groupList = [];
        this.userGroupIds = [];
        this.config = { limit: defaultAmount };
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

    /**
     * Viewable user changed handler.
     *
     * Sets the user object of the view user page.
     *
     * @public
     * @param {string} viewableUserId
     */
    onSetViewableUserId(viewableUserId) {
        this.viewableUserId = viewableUserId;
    }

    /**
     * Viewable user cleared handler.
     *
     * Clears the viewable user.
     *
     * @public
     */
    onClearViewableUserId() {
        this.viewableUserId = undefined;
    }

    /**
     * Is changing password flag value changed handler.
     *
     * @public
     * @param {boolean} isChangingPassword Flag showing if the password is being changed.
     */
    onSetIsChangingPassword(isChangingPassword) {
        this.isChangingPassword = isChangingPassword;
    }

    /**
     * Handler for conflicts (status 409) in the API.
     */
    onUpdateConflict() {
        toastr.error('Lietotājs ar norādīto e-pastu jau eksistē');
    }
}

export default alt.createStore(UserStore);
