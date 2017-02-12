import EntryActions from '../actions/EntryActions';

class EntryStore {
    constructor() {
        this.bindActions(EntryActions);

        this.entry = {};
        this.list = [];
        this.isUpdating = false;
        this.isCreating = false;
        this.isRequesting = false;
    }

    onReceived(entry) {
        this.entry = entry;
    }

    onCreated(entry) {
        this.list.unshift(entry);
    }

    onUpdated(updatedEntry) {
        this._onUpdated(updatedEntry);
        toastr.success('Info veiksmīgi atjaunināta');
    }

    onSilentUpdated(updatedEntry) {
        this._onUpdated(updatedEntry);
    }

    onDeleted(deletedEntry) {
        this.list.some((entry, index) => {
            if (entry._id === deletedEntry._id) {
                this.list.splice(index, 1);

                return true;
            }
        });

        toastr.success('Izdzēšana notikusi veiksmīgi');
    }

    onListReceived(list) {
        this.list = list;
    }

    onSetUpdatable(updatable) {
        this.updatable = updatable;
    }

    onSetIsUpdating(isUpdating) {
        this.isUpdating = isUpdating;
    }

    onSetIsCreating(isUpdating) {
        this.isCreating = isUpdating;
    }

    onSetIsRequesting(isRequesting) {
        this.isRequesting = isRequesting;
    }

    onUpdateConflict() {
        toastr.error('Resurss jau eksistē');
    }

    _onUpdated(updatedEntry) {
        this.list.some((entry, index) => {
            if (entry._id === updatedEntry._id) {
                this.list.splice(index, 1);
                this.list.unshift(updatedEntry);

                return true;
            }
        });

        if (this.entry._id === updatedEntry._id) {
            this.entry = updatedEntry;
        }
    }
}

export default EntryStore;
