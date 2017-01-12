import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        this.user = {};
    }

    onGetCurrentUser() {
        return this.user;
    }

    onUserReceived(user) {
        this.user = user;
    }
}

export default alt.createStore(UserStore, 'UserStore');
