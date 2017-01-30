import alt from '../alt';
import UserActions from '../actions/UserActions';
import { createObject } from '../utils/utils';
import { userFieldNames } from '../utils/config';

class UserStore {
    constructor() {
        const { general, admin_fields } = userFieldNames;

        this.bindActions(UserActions);

        this.user = {};
        this.userList = [];
        this.isUpdating = false;
        this.isCreating = false;
        this.isChangingPassword = false;
        this.isRequesting = false;
        this.updatable = createObject(general, {});
        this.updatable.admin_fields = createObject(admin_fields, {});
    }

    onUserReceived(user) {
        this.user = user;
    }

    onUserDeleted(deletedUser) {
        this.userList.some((user, index) => {
            if (user._id === deletedUser._id) {
                this.userList.splice(index, 1);

                return true;
            }
        });

        toastr.success('Lietotājs veiksmīgi izdzēsts');
    }

    onUserCreated(user) {
        this.userList.unshift(user);
    }

    onUserUpdated(updatedUser) {
        this.userList.some((user, index) => {
            if (user._id === updatedUser._id) {
                this.userList.splice(index, 1);
                this.userList.unshift(updatedUser);

                return true;
            }
        });

        if (this.user._id === updatedUser._id) {
            this.user = updatedUser;
        }

        toastr.success('Lietotāja info veiksmīgi atjaunināta');
    }

    onUserListReceived(userList) {
        this.userList = userList;
    }

    onSetUpdatableUser(updatable) {
        this.updatable = updatable;
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

    onUserUpdateConflict() {
        toastr.error('Lietotājs ar norādīto e-pastu jau eksistē');
    }
}

export default alt.createStore(UserStore, 'UserStore');
