import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        this.user = {};
        this.userList = [];
        // this.isRequesting = false;
        this.updatable = {};

        // create an empty updatable user and form
        // this.onClearForm();
        // this.onClearUpdatableUser();
    }

    onGetCurrentUser() {
        return this.user;
    }

    onUserReceived(user) {
        this.user = user;
    }

    onUserDeleted(deletedUser) {
        // TODO: figure out a better way to do this
        this.userList.some((user, index) => {
            if (user._id === deletedUser._id) {
                this.userList.splice(index, 1);

                return true;
            }
        });
    }

    onUserUpdated(updatedUser) {
        // TODO: figure out why this isn't working properly
        // TODO: return updated, not old user......
        // TODO: figure out a better way to do this
        this.userList.some((user, index) => {
            if (user._id === updatedUser._id) {
                this.userList.splice(index, 1);
                this.userList.unshift(updatedUser);

                return true;
            }
        });
    }

    onUserListReceived(userList) {
        this.userList = userList;
    }

    // onUpdateIsRequesting(isRequesting) {
    //     this.isRequesting = isRequesting;
    // }

    // onClearForm() {
    //     this.form = {
    //         emailTouched: false,
    //         emailValid: false,
    //         passwordTouched: false,
    //         passwordValid: false,
    //     }
    // }

    // onSetForm(form) {
    //     this.form = form;
    // }

    onSetUpdatableUser(user) {
        this.updatable = user;
    }

    // onClearUpdatableUser() {
    //     this.updatable = {
    //         _id: '',
    //         given_name: '',
    //         family_name: '',
    //         email: '',
    //         is_admin: '',
    //         is_blocked: ''
    //     };
    // }
}

export default alt.createStore(UserStore, 'UserStore');
