import alt from '../alt';

class UserActions {

    constructor() {
        this.generateActions(
            'userReceived'
        );
    }

}

export default alt.createActions(UserActions);
