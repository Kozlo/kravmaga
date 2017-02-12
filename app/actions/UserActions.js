import alt from '../alt';
import EntryActions from './EntryActions';
import { userFieldNames, generalConfig } from '../utils/config';
import { createObject } from '../utils/utils';

class UserActions extends EntryActions {
    constructor(props) {
        super(props);

        this.generateActions(
            'getCurrentUser',
            'setIsChangingPassword',
            'groupListReceived',
            'userGroupsReceived',
            'userGroupIdAdded',
            'userGroupIdRemoved',
        );

        this.url = generalConfig.api.usersUrl;
    }

    /**
     * Creates and sets a new updatable based on the passed user's properties.
     *
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const { general, admin_fields } = userFieldNames;
        const updatable = createObject(general, entry);

        updatable.admin_fields = createObject(admin_fields, entry.admin_fields || {});

        return this.setUpdatable(updatable);
    }
}

export default alt.createActions(UserActions);
