import alt from '../alt';
import EntryStore from './EntryStore';
import UserActions from '../actions/UserActions';
import { createObject } from '../utils/utils';
import { userFieldNames } from '../utils/config';

class UserStore extends EntryStore {
    constructor(props) {
        const { general, admin_fields } = userFieldNames;

        super(props);

        this.bindActions(UserActions);

        this.isChangingPassword = false;
        this.updatable = createObject(general, {});
        this.updatable.admin_fields = createObject(admin_fields, {});
    }

    onSetIsChangingPassword(isChangingPassword) {
        this.isChangingPassword = isChangingPassword;
    }

    onUpdateConflict() {
        toastr.error('Lietotājs ar norādīto e-pastu jau eksistē');
    }
}

export default alt.createStore(UserStore);
