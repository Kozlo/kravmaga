import alt from '../alt';

class AuthActions {

    constructor() {
        this.generateActions(
            'getToken',
            'loginUser',
            'logoutUser',
            'silentLogoutUser'
        );
    }

}

export default alt.createActions(AuthActions);
