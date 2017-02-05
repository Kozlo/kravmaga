import alt from '../alt';
import EntryActions from './EntryActions';
import { httpStatusCode } from '../utils/utils';

// TODO: move to config
const url = '/groups';

// TODO: try to make an abstract store/actions for data updates
class GroupActions extends EntryActions {
    constructor(props) {
        super(props);

        this.generateActions(
            'membersReceived',
        );

        this._url = url;
    }

    getMembers(id, token) {
        const statusCode = Object.assign({ 200: members => this.membersReceived({ id, members} ) }, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this._url}?filters=groupId=${id}`,
            method: 'GET',
        };

        // TODO: figure out how to filter users with a specific groups correctly

        return this._sendRequest(requestProps, token);
    }
}

export default alt.createActions(GroupActions);
