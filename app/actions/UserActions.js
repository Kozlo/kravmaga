import alt from '../alt';
import { httpStatusCode, httpSuccessHandler, httpErrorHandler, getAuthorizationHeader } from '../utils/utils';

class UserActions {

    constructor() {
        this.generateActions(
            'userReceived'
        );
    }

    getUsers(filters, successHandler) {
        const statusCode = $.extend({ 200: users => successHandler(users)}, httpStatusCode);

        return this._sendRequest({
            statusCode,
            url: '/users',
            method: 'GET',
            data: { filters },
            headers: getAuthorizationHeader()
        });
    }

    _sendRequest(request) {
        return $.ajax(request)
            .done(data => httpSuccessHandler(data))
            .fail(e => httpErrorHandler(e));
    }

}

export default alt.createActions(UserActions);
