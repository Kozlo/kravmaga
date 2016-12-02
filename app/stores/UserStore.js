import alt from '../alt';
import UserActions from '../actions/UserActions';

class UserStore {
    constructor() {
        this.bindActions(UserActions);
        this.user = false;
    }

    onLoginSuccess(data) {
        this.user = data;
        toastr.success(`Welcome ${data.username}!`);
    }

    onLoginFail(errorMessage) {
        toastr.error(errorMessage);
    }

    onLogoutSuccess(data) {
        this.user = false;
        toastr.success(`Goodbye ${data.username}!`);
    }

    onLogoutFail(errorMessage) {
        toastr.error(errorMessage);
    }
}

export default alt.createStore(UserStore);
