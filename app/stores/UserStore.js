import alt from '../alt';
import UserActions from '../actions/UserActions';

import { objectIsEmpty } from '../utils/utils';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        this.user = {};
        this.userList = [];
        this.updatable = { given_name : '', family_name: '', email: '', gender: '', picture: '', is_blocked: '', is_admin: '' };
    }

    onGetCurrentUser() {
        return this.user;
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

    onUserUpdated(updatedUser) {
        this.userList.some((user, index) => {
            if (user._id === updatedUser._id) {
                this.userList.splice(index, 1);
                this.userList.unshift(updatedUser);
                this._checkForUserUpdate(updatedUser);

                return true;
            }
        });

        toastr.success('Lietotāja info veiksmīgi atjaunināta');
    }

    onUserListReceived(userList) {
        this.userList = userList;
    }

    onSetUpdatableUser(updatable) {
        this.updatable = updatable;
    }

    _checkForUserUpdate(updatedUser) {
        // if the current user updates seld via the admin panel, the profile data should reflect the changes too
        if (objectIsEmpty(this.user) || this.user._id === updatedUser._id) {
            this.user = updatedUser;
        }
    }

}

export default alt.createStore(UserStore, 'UserStore');
