import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        // TODO: figure out is this is needed or if it can be removed
        this.user = {};
    }

    onUserReceived(User) {
        this.user = User;
    }
}

export default alt.createStore(UserStore, 'UserStore');
