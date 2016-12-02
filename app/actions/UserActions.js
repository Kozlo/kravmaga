import alt from '../alt';

class UserActions {
    constructor() {
        this.generateActions(
            'loginSuccess',
            'loginFail',
            'logoutSuccess',
            'logoutFail',
            'getUser'
        );
    }

    login() {
        // TODO: add Auth0 implementation here and replace the dummy one
        const shouldLogin = true;

        new Promise((resolve, reject) => {
            if (shouldLogin) {
                const user = { username: 'Dummy User'};
                resolve(user);
            } else {
                const reason = new Error('Could not log in user :(');
                reject(reason);
            }
        }).then(user => {
            this.actions.loginSuccess(user);
        }).catch(error => {
            this.actions.loginFail(error);
        });
    }

    logout() {
        // TODO: add Auth0 implementation here and replace the dummy one
        const shouldLogout = true;

        new Promise((resolve, reject) => {
            if (shouldLogout) {
                const user = { username: 'Dummy User'};
                resolve(user);
            } else {
                const reason = new Error('Could not log out user :(');
                reject(reason);
            }
        }).then(user => {
            this.actions.logoutSuccess(user);
        }).catch(error => {
            this.actions.logoutFail(error);
        });        // TODO: add Auth0 implementation here and replace the dummy one
    }
}

export default alt.createActions(UserActions);
