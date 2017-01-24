import alt from '../alt';
import UserActions from '../actions/UserActions';
import { userFields } from '../utils/config';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        this.user = {};
        this.userList = [];
        this.updatable = { admin_fields: {} };

        this._generateUpdatableFields(userFields);
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

                return true;
            }
        });

        this._checkForUserUpdate(updatedUser);

        toastr.success('Lietotāja info veiksmīgi atjaunināta');
    }

    onUserListReceived(userList) {
        this.userList = userList;
    }

    onSetUpdatableUser(updatable) {
        this.updatable = updatable;
    }

    onUserUpdateConflict() {
        toastr.error('Lietotājs ar norādīto e-pastu jau eksistē');
    }

    _checkForUserUpdate(updatedUser) {
        if (this.user._id === updatedUser._id) {
            this.user = updatedUser;
        }
    }

    _generateUpdatableFields(fields) {
        fields.general.forEach(fieldName => this.updatable[fieldName] = '');
        fields.admin_fields.forEach(fieldName => this.updatable.admin_fields[fieldName] = '');
    }

}

export default alt.createStore(UserStore, 'UserStore');
