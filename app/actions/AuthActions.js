import alt from '../alt';

class AuthActions {

    constructor() {
        this.generateActions(
            'loginUser',
            'logoutUser'
        );
    }

}

export default alt.createActions(AuthActions);
