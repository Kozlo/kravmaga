import alt from '../alt';
import { httpStatusCode, fetchData } from '../utils/utils';

class AuthActions {
    constructor() {
        this.generateActions(
            'userLoggedIn',
            'logoutUser',
            'silentLogoutUser',
        );
    }

    login(email, password) {
        const statusCode = Object.assign({ 200: data => this.userLoggedIn(data) }, httpStatusCode);
        const request = {
            statusCode,
            data: { email, password },
            url: '/login',
            method: 'POST'
        };

        return fetchData(request);
    }
}

export default alt.createActions(AuthActions);
