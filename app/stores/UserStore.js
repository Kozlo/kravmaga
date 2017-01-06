import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);

        // TODO: figure out is this is needed or if it can be removed
        this.user = {};
    }

    onUserReceived(user) {
        this.user = user;
    }
}

export default alt.createStore(UserStore, 'UserStore');
